<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Inertia\Inertia;

class GameController extends Controller
{
    public function __invoke() {
        $game = Game::where('is_active', true)->with('type')->get();

        return Inertia::render('Game', [
            'game' => $game,
        ]);
    }
}
