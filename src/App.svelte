<script>
  import Footer from './routes/Footer.svelte';
  import Header from './routes/Header.svelte';
  import Filter from './routes/Filter.svelte';
  import TailwindCss from './lib/TailwindCSS.svelte';
  import Cars from './routes/Cars.svelte'
  import CarDetails from "./routes/CarDetails.svelte";
  import Login from './routes/Login.svelte';
  import Register from './routes/Register.svelte';
  import User from './routes/User.svelte';

  import { onMount } from 'svelte';
 
  import Page from 'page';

  let currentRoute;
  let currentParams;

  let cars = [];
  let filteredCars = [];
  let selectedBrand = '';
  let selectedMake = '';
  let tempMinYear = '';
  let tempMaxYear = '';

  let loggedInUser = null;

  
  Page('/', (ctx) => { 
    currentRoute = Cars; 
    currentParams = ctx.params;
  });
  
  Page('/cars/:id', (ctx) => {
    currentRoute = CarDetails;
    currentParams = ctx.params;
  });

  Page('/auth/login', (ctx) => { 
    currentRoute = Login; 
    currentParams = ctx.params; 
  });

  Page('/auth/register', (ctx) => { 
    console.log('routed to login')
    currentRoute = Register; 
    currentParams = ctx.params;
  });

  Page('/auth/profile/:id', (ctx) => { 
    currentRoute = User;
    currentParams = ctx.params;
  });
  
  Page('*', (ctx) => { 
    currentRoute = undefined; 
    currentParams = ctx.params;
    console.error('Route not found');
  });

  
  Page.start();



  const handleLogin = (event) => {
    const { username } = event.detail;
    loggedInUser = username;
    Page('/');
  };

  const handleRegister = (event) => {
    const { token, username } = event.detail;
    loggedInUser = username;
    Page('/');
  };

  function refreshCars() {
    fetch("http://localhost:3000/cars")
      .then(response => response.json())
      .then(data => {
        cars = data;
        filteredCars = data;
      });
  }

  function handleFilter(event) {
    selectedBrand = event.detail.selectedBrand;
    selectedMake = event.detail.selectedMake;
    tempMinYear = event.detail.minYear;
    tempMaxYear = event.detail.maxYear;

    filteredCars = cars.filter(car => {
      return (
        (selectedBrand ? car.brand === selectedBrand : true) &&
        (selectedMake ? car.model === selectedMake : true) &&
        (tempMinYear ? car.year >= parseInt(tempMinYear) : true) &&
        (tempMaxYear ? car.year <= parseInt(tempMaxYear) : true)
      );
    });
  }

  function handleClearFilters() {
    selectedBrand = '';
    selectedMake = '';
    tempMinYear = '';
    tempMaxYear = '';
    filteredCars = cars;
  }

</script>

<TailwindCss />

<Header />

<svelte:component this={currentRoute} {currentParams}/>

<Footer />
