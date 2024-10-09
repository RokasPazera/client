<script>
    import Modal from "./Modal.svelte";
    import Page from 'page';
    let showModal = false;

    const navigateToHome = () => {
        Page('/');
    };
    
</script>

<Modal {showModal} on:click={() => (showModal = !showModal)}></Modal>

<header class="bg-[#1C1E21] text-white flex justify-between items-center h-16 p-4 shadow-md">
    <h1 class="text-lg font-bold flex items-center">
        <a on:click={navigateToHome} class="flex items-center cursor-pointer">
        <img src="/one-yaris-toyota.gif" alt="Logo" class="h-12 max-h-full mr-4">
        <span>Best BMW auction site!</span>
    </a>
    </h1>
    <nav>
        <ul class="flex space-x-4">
            <li>
                <button
                    on:click={() => (showModal = !showModal)}
                    class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition duration-300 text-sm">
                    Log In
                </button>
            </li>
        </ul>
    </nav>
</header>






<style>
    h1{
        margin: 0;
    }

    img{
        max-height: 100%;
    }
</style>
