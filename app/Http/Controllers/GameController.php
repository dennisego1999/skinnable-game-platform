<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Inertia\Inertia;

class GameController extends Controller
{
    public function __invoke() {
        return Inertia::render('Game', [
            'game' => Game::where('is_active', true)->get(),
        ]);
    }
}
