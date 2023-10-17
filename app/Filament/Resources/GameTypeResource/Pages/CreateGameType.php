<?php

namespace App\Filament\Resources\GameTypeResource\Pages;

use App\Filament\Resources\GameTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateGameType extends CreateRecord
{
    use CreateRecord\Concerns\Translatable;

    protected static string $resource = GameTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make(),
        ];
    }
}
