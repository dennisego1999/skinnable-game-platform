<?php

namespace Database\Seeders;

use App\Models\GameType;
use Illuminate\Database\Seeder;

class GameTypeSeeder extends Seeder
{
    private array $gameTypes = [
        '3D Experience Game',
        '2D Experience Game',
        'AR Experience Game'
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->createGameTypes();
    }

    private function createGameTypes()
    {
        foreach ($this->gameTypes as $type) {
            GameType::factory()->create([
                'name' => $type
            ]);
        }
    }
}
