<?php

namespace App\Policies;

use App\Models\GameType;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class GameTypePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, GameType $model): bool
    {
        return $user->isAdmin();
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
        // Prevent deleting yourself
        if ($user->is($model)) {
            return false;
        }

        return $user->isAdmin();
    }
}
