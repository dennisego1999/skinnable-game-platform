<?php

namespace App\Filament\Resources\GameTypeResource\Pages;

use App\Filament\Resources\GameTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditGameType extends EditRecord
{
    use EditRecord\Concerns\Translatable;

    protected static string $resource = GameTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }
}
