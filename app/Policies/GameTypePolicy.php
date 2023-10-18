<?php

namespace App\Policies;

use App\Models\GameType;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class GameTypePolicy
{
    use HandlesAuthorization;

    public function view(User $user, GameType $model): bool
    {
        return true;
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, GameType $model): bool
    {
        return false;
    }

    public function delete(User $user, GameType $model): bool
    {
        return false;
    }
}
