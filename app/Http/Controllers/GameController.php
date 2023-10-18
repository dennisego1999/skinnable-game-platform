<?php

namespace App\Http\Controllers;

use App\Http\Resources\GameResource;
use App\Models\Game;
use Inertia\Inertia;

class GameController extends Controller
{
    public function __invoke() {
        $game = Game::with('type')->where('is_active', true)->first();

        return Inertia::render('Game', [
            'game' => new GameResource($game),
        ]);
    }
}
