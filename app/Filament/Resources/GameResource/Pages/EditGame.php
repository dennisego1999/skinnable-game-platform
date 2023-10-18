<?php

namespace App\Filament\Resources\GameResource\Pages;

use App\Filament\Resources\GameResource;
use App\Models\Game;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditGame extends EditRecord
{
    use EditRecord\Concerns\Translatable;

    protected static string $resource = GameResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\LocaleSwitcher::make(),
        ];
    }

//    protected function mutateFormDataBeforeSave(array $data): array
//    {
//        if($data['is_active']) {
//            //Check if there is another active game
//            $currentActiveGame = Game::where('is_active', true)
//                ->where('id', '!=', $data['id'])
//                ->first();
//
//            //Disable
//            $currentActiveGame?->update(['is_active' => false]);
//        }
//
//        return $data;
//    }
}
