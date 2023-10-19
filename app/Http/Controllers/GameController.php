<?php

namespace App\Http\Controllers;

use App\Http\Resources\GameResource;
use App\Models\Game;
use Inertia\Inertia;

class GameController extends Controller
{
    public function __invoke() {
        $game = Game::active()->with('type')->first();

        return Inertia::render('Game', [
            'game' => $game ? new GameResource($game) : null,
        ]);
    }
}
