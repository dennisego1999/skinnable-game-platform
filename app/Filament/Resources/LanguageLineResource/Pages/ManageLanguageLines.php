<?php

namespace App\Filament\Resources\LanguageLineResource\Pages;

use App\Filament\Resources\LanguageLineResource;
use ArtcoreSociety\TranslationImport\Commands\ImportTranslationsCommand;
use ArtcoreSociety\TranslationImport\Excel\LanguageLineExport;
use ArtcoreSociety\TranslationImport\Excel\LanguageLineImport;
use Closure;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ManageRecords;
use Filament\Forms;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;

class ManageLanguageLines extends ManageRecords
{
    protected static string $resource = LanguageLineResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make(__('filament.labels.language_lines.import'))
                ->icon('heroicon-m-arrow-up-tray')
                ->action(function ($data) {
                    Excel::import(new LanguageLineImport(), $data['excel']);

                    Notification::make()
                        ->title(__('filament.notifications.translations_imported'))
                        ->success()
                        ->send();
                })
                ->form([
                    Forms\Components\FileUpload::make('excel')
                        ->disk('local')
                        ->directory('filament-import')
                        ->acceptedFileTypes(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
                        ->required()
                        ->rules([
                            function (\Filament\Forms\Set $set) {
                                return static function (string $attribute, $value, Closure $fail) use($set) {
                                    try {
                                        Excel::import(new LanguageLineImport(validateOnly: true), $value);
                                    } catch (ValidationException $e) {
                                        $errors = [];

                                        foreach ($e->failures() as $failure) {
                                            foreach ($failure->errors() as $error) {
                                                $errors[] = 'Row ' . $failure->row() . ': ' . $error;
                                            }
                                        }

                                        $set('errors', implode(PHP_EOL, $errors));
                                        $fail('One or more rows have issues.');
                                    }
                                };
                            }
                        ]),

                    Forms\Components\Textarea::make('errors')
                        ->hidden(fn($state) => blank($state))
                        ->dehydrated(false)
                        ->disabled()
                ]),

            Action::make(__('filament.labels.language_lines.export'))
                ->icon('heroicon-m-arrow-down-tray')
                ->action(fn() => Excel::download(new LanguageLineExport(), 'language-lines.xlsx')),

            Action::make(__('filament.labels.language_lines.scan'))
                ->color('gray')
                ->icon('heroicon-m-arrow-path-rounded-square')
                ->action(function () {
                    Artisan::call(ImportTranslationsCommand::class);

                    Notification::make()
                        ->title(__('filament.notifications.translation_scanned'))
                        ->success()
                        ->send();
                })
        ];
    }
}
