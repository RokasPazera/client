<script>
    import { userStore } from '../stores/userStores.js';
    import { tokenStore } from '../stores/authStore.js';
    import Page from 'page';

    let user;
    let token;

    userStore.subscribe(value => {
        user = value;
    });

    tokenStore.subscribe(value => {
        token = value;
    })

    const handleLogout = () => {
        userStore.set({
            id: null,
            username: '',
            email: '',
            isAdmin: false,
        });
        tokenStore.set(null);
        Page('/');
    }

    const navigateToProfile = () => {
        if (user) {
            Page('/auth/profile/${user.id}');
        }
    };

    const navigateToLogin = () => {
        Page('/auth/login');
    };
</script>

<header class="bg-[#1C1E21] text-white flex justify-between items-center h-16 p-4 shadow-md">
    <h1 class="text-lg font-bold flex items-center">
        <a on:click={() => Page('/')} class="flex items-center cursor-pointer">
            <img src="/one-yaris-toyota.gif" alt="Logo" class="h-12 max-h-full mr-4">
            <span>Best BMW auction site!</span>
        </a>
    </h1>
    <nav>
        <ul class="flex space-x-4">
            {#if user.id !== null}
                <li>
                    <button
                        on:click={navigateToProfile}
                        class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition duration-300 text-sm">
                        User
                    </button>
                </li>
                <li>
                    <button
                        on:click={handleLogout}
                        class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition duration-300 text-sm">
                        logout
                    </button>
                </li>
            {:else}
                <li>
                    <button
                        on:click={navigateToLogin}
                        class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition duration-300 text-sm">
                        Log In
                    </button>
                </li>
            {/if}
        </ul>
    </nav>
</header>
