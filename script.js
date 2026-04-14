const BASE_URL = "http://127.0.0.1:5000";

let lineChart, barChart;

// Utility: Show loading
function showLoading() {
    document.body.style.cursor = "wait";
}

// Utility: Hide loading
function hideLoading() {
    document.body.style.cursor = "default";
}

// Fetch Data
async function fetchData(endpoint = "/data") {
    try {
        showLoading();

        const response = await fetch(BASE_URL + endpoint);
        if (!response.ok) throw new Error("API Error");

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data from server");
        return [];
    } finally {
        hideLoading();
    }
}

// Initialize Charts
function renderCharts(data) {
    const prices = data.map(d => d.price);
    const areas = data.map(d => d.area);

    // Destroy old charts
    if (lineChart) lineChart.destroy();
    if (barChart) barChart.destroy();

    // Line Chart (Price vs Area)
    const ctx1 = document.getElementById("lineChart").getContext("2d");
    lineChart = new Chart(ctx1, {
        type: "line",
        data: {
            labels: areas,
            datasets: [{
                label: "Price vs Area",
                data: prices,
                borderWidth: 2,
                tension: 0.3
            }]
        }
    });

    // Bar Chart (Distribution)
    const ctx2 = document.getElementById("barChart").getContext("2d");
    barChart = new Chart(ctx2, {
        type: "bar",
        data: {
            labels: areas,
            datasets: [{
                label: "Price Distribution",
                data: prices,
                borderWidth: 1
            }]
        }
    });
}

// Load Initial Data
async function loadData() {
    const data = await fetchData("/data");
    renderCharts(data);
}

// Apply Filter (Price + Area)
async function applyFilter() {
    const minPrice = document.getElementById("minPrice").value || 0;
    const maxPrice = document.getElementById("maxPrice").value || 1000000;

    const url = `/filter?min_price=${minPrice}&max_price=${maxPrice}`;
    const data = await fetchData(url);

    renderCharts(data);
}

// Search by Bedrooms
async function searchBedrooms() {
    const bedrooms = document.getElementById("bedrooms").value;

    if (!bedrooms) {
        alert("Enter bedrooms value");
        return;
    }

    const data = await fetchData(`/search?bedrooms=${bedrooms}`);
    renderCharts(data);
}

// Show Top Properties
async function showTop() {
    const data = await fetchData("/top?n=5");
    renderCharts(data);
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// Refresh Data
async function refreshData() {
    await loadData();
}

// Initialize App
window.onload = () => {
    loadData();
};
