<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Game extends Model
{
    protected $fillable = [
        'name',
        'game_type_id',
        'is_active',
        'background_color',
        'accent_color',
    ];

    /*
    |--------------------------------------------------------------------------
    | FUNCTIONS
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function type(): belongsTo
    {
        return $this->belongsTo(GameType::class, 'game_type_id');
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES
    |--------------------------------------------------------------------------
    */

    /*
   |--------------------------------------------------------------------------
   | ACCESSORS
   |--------------------------------------------------------------------------
   */
}
