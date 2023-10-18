<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id ?? null,
            'name' => $this->name ?? null,
            'is_active' => $this->is_active ?? null,
            'background_color' => $this->background_color ?? null,
            'accent_color' => $this->accent_color ?? null,
            'type' => new GameTypeResource($this->type ?? null)
        ];
    }
}
