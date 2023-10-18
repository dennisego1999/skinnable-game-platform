<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LanguageLineResource\Pages;
use ArtcoreSociety\TranslationImport\Models\LanguageLine;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables;
use Illuminate\Database\Eloquent\Builder;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

class LanguageLineResource extends Resource
{
    protected static ?string $model = LanguageLine::class;

    protected static ?string $navigationGroup = 'Translations';

    protected static ?string $navigationIcon = 'heroicon-o-language';

    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        $locales = LaravelLocalization::getSupportedLocales();

        $fields = collect($locales)->map(function ($locale, $key) {
            return Forms\Components\TextInput::make("text.$key")
                ->label($locale['name']);
        });

        return $form
            ->schema([
                Forms\Components\TextInput::make('group')
                    ->dehydrated(false)
                    ->disabled(),
                Forms\Components\TextInput::make('key')
                    ->dehydrated(false)
                    ->disabled(),
                Forms\Components\Fieldset::make('Translations')
                    ->columns(1)
                    ->schema($fields->toArray())
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('group')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('key')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('text')
                    ->getStateUsing(fn ($record) => data_get($record->text, app()->getLocale(), $record->text))
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->whereRaw("LOWER(text) LIKE ?", ["%$search%"]);
                    })
                    ->sortable()
                    ->size('sm')
                    ->limit()
                    ->wrap(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->since()
                    ->sortable()
                    ->alignRight()
                    ->size('sm'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([])
            ->paginated([5, 10, 25, 50]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageLanguageLines::route('/'),
        ];
    }
}
