<?php

namespace App\Filament\Resources\GameTypeResource\Pages;

use App\Filament\Resources\GameTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewGameType extends ViewRecord
{
    use ViewRecord\Concerns\Translatable;

    protected static string $resource = GameTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }
}
