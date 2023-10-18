<?php

namespace App\Filament\Resources;

use App\Filament\Resources\GameResource\Pages;
use App\Filament\Resources\GameResource\RelationManagers;
use App\Models\Game;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Concerns\Translatable;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class GameResource extends Resource
{
    use Translatable;

    protected static ?string $model = Game::class;

    protected static ?string $navigationIcon = 'heroicon-o-puzzle-piece';

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?int $navigationSort = 2;

    public static function getNavigationGroup(): ?string
    {
        return __('filament.labels.navigation.resources');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Tabs::make('Label')
                    ->schema([
                        Forms\Components\Tabs\Tab::make('Information')
                            ->schema([
                                Forms\Components\Hidden::make('id'),
                                Forms\Components\TextInput::make('name')
                                    ->required(),
                                Forms\Components\Select::make('game_type_id')
                                    ->relationship(
                                        name: 'Type',
                                        titleAttribute: 'name',
                                    )
                                    ->getOptionLabelFromRecordUsing(fn (Model $record) => "{$record->name}")
                                    ->searchable()
                                    ->preload()
                                    ->required(),
                            ]),
                        Forms\Components\Tabs\Tab::make('Skin')
                            ->schema([
                                Forms\Components\ColorPicker::make('background_color')
                                    ->rgba(),
                                Forms\Components\ColorPicker::make('accent_color')
                                    ->rgba(),
                            ])
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('type.name')
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('background_color')
                    ->searchable(),
                Tables\Columns\TextColumn::make('accent_color')
                    ->searchable(),
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
                Tables\Actions\Action::make('Activate')
                    ->label(trans('filament.actions.activate'))
                    ->color('success')
                    ->icon('heroicon-o-check')
                    ->requiresConfirmation()
                    ->action(function (Game $record) {
                        Game::query()->update(['is_active' => false]);

                        $record->is_active = true;
                        $record->save();
                    })
                    ->hidden(fn (Game $record) => $record->is_active),
                Tables\Actions\Action::make('Disable')
                    ->label(trans('filament.actions.disable'))
                    ->color('danger')
                    ->icon('heroicon-o-x-mark')
                    ->requiresConfirmation()
                    ->action(function (Game $record) {
                        $record->is_active = false;
                        $record->save();
                    })
                    ->hidden(fn (Game $record) => !$record->is_active),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListGames::route('/'),
            'create' => Pages\CreateGame::route('/create'),
            'view' => Pages\ViewGame::route('/{record}'),
            'edit' => Pages\EditGame::route('/{record}/edit'),
        ];
    }
}
