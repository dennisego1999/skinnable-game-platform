<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LanguageLineResource\Pages;
use App\Filament\Resources\LanguageLineResource\RelationManagers;
use ArtcoreSociety\TranslationImport\Models\LanguageLine;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class LanguageLineResource extends Resource
{
    protected static ?string $model = LanguageLine::class;

    protected static ?string $navigationIcon = 'heroicon-o-language';

    protected static ?int $navigationSort = 4;

    public static function getNavigationGroup(): ?string
    {
        return __('filament.labels.navigation.translations');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                //
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                //
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLanguageLines::route('/'),
            'create' => Pages\CreateLanguageLine::route('/create'),
            'edit' => Pages\EditLanguageLine::route('/{record}/edit'),
        ];
    }
}
