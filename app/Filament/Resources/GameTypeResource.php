<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GameTypeResource\Pages;
use App\Filament\Resources\GameTypeResource\RelationManagers;
use App\Models\GameType;
use Closure;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class GameTypeResource extends Resource
{
    protected static ?string $model = GameType::class;

    protected static ?string $navigationGroup = 'Resources';

    protected static ?string $navigationIcon = 'heroicon-o-ellipsis-horizontal-circle';

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?string $navigationLabel = 'Types';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make([
                    Forms\Components\TextInput::make('name')
                        ->reactive()
//                        ->afterStateUpdated(function (Closure $set, $state) {
//                            $set('slug', Str::slug($state));
//                        })->required(),
//                    Forms\Components\TextInput::make('slug')
//                        ->required(),
                ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
            'index' => Pages\ListGameTypes::route('/'),
            'create' => Pages\CreateGameType::route('/create'),
            'edit' => Pages\EditGameType::route('/{record}/edit'),
        ];
    }
}
