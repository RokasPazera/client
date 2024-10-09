<script>
    export let showModal = false;
    export let isPromo = false;
    export let register = false;
    export let login = false;
    import TailwindCss from '../lib/TailwindCSS.svelte';
    import AddUser from './AddUser.svelte';

    let users = [];

    const toggleRegister = () => {
        register = true;
        login = false;
    }

    const toggleLogin = () => {
        login = true;
        register = false;
    }

    const addUser = (e) => {
        const user = e.detail;
        users = [user, ...users];
        console.log(users);
    }


</script>
<TailwindCss/>

{#if showModal}
<div class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
    <div class="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 class="text-2xl font-bold mb-4">Welcome!</h2>
        <div class="flex items-center justify-center mb-4">
            <img src="/yaris-toyota.gif" alt="Logo" class="h-12 max-h-full mx-2">
            <button 
                on:click={toggleRegister} 
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 mr-2">
                Register
            </button>
            <button 
                on:click={toggleLogin} 
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300">
                Log In
            </button>
            <img src="/yaris-toyota.gif" alt="Logo" class="h-12 max-h-full mx-2">
        </div>

        {#if register}
            <AddUser on:addUser={addUser} />
        {/if}

        {#if login}
            <form class="space-y-4">
                <input 
                    type="email" 
                    placeholder="Email" 
                    class="block w-full p-2 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    class="block w-full p-2 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                
                <button 
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 w-full">
                    Log In
                </button>
            </form>
        {/if}

        <div class="mt-4">
            <button 
                on:click={() => (isPromo = false)} on:click
                class="text-red-500 hover:text-red-700 transition duration-300">
                No? :(
            </button>
        </div>
    </div>
</div>
{/if}