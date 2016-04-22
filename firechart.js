(function() {

   var firebaseRef;

   var ctxSalesByMonth = $("#salesByMonth").get(0).getContext("2d");
   var ctxSalesByPerson = $("#salesByPerson").get(0).getContext("2d");
   var ctxSalesByRegion = $("#salesByRegion").get(0).getContext("2d");

   var dataSalesByMonth = {
                       labels : [],
                       datasets: [
                       {
                           label: "Total Sales",
                           fillColor: "rgba(67, 214, 92, 0.5)", 
                           strokeColor: "rgba(67, 214, 92, 1)",
                           pointColor: "rgba(67, 214, 92,1)",
                           pointStrokeColor: "#fff",
                           pointHighlightFill: "#fff",
                           pointHighlightStroke: "rgba(67, 214, 92,1)",
                           data: []
                       },
                       {
                           label: "Gross Profit",
                           fillColor: "rgba(218, 233, 39, 0.5)", 
                           strokeColor: "rgba(218, 233, 39, 1)",
                           pointColor: "rgba(218, 233, 39,1)",
                           pointStrokeColor: "#fff",
                           pointHighlightFill: "#fff",
                           pointHighlightStroke: "rgba(218, 233, 39,1)",
                           data: []
                       }                         
                   ]};

   var dataSalesByPerson = {
                       labels : ["Bill", "Bob", "Jane", "Judy", "Max", "Holly"],
                       datasets: [
                       {
                           label: "Total Sales",
                           fillColor: "rgba(67, 214, 92, 0.5)", 
                           strokeColor: "rgba(67, 214, 92, 1)",
                           pointColor: "rgba(67, 214, 92,1)",
                           pointStrokeColor: "#fff",
                           pointHighlightFill: "#fff",
                           pointHighlightStroke: "rgba(67, 214, 92,1)",
                           data: [20000, 25000, 30000, 22000, 28000, 34000]
                       },
                       {
                           label: "Gross Profit",
                           fillColor: "rgba(218, 233, 39, 0.5)", 
                           strokeColor: "rgba(218, 233, 39, 1)",
                           pointColor: "rgba(218, 233, 39,1)",
                           pointStrokeColor: "#fff",
                           pointHighlightFill: "#fff",
                           pointHighlightStroke: "rgba(218, 233, 39,1)",
                           data: [10000, 12500, 15000, 11000, 14000, 17000]
                       }                         
                   ]};

   var dataSalesByRegion = [
                       {
                           label: "West USA",
                           color: "rgba(67, 214, 92, 0.5)", 
                           highlight: "rgba(67, 214, 92, 1)",
                           value: 20000
                       },
                       {
                           label: "UK",
                           color: "rgba(218, 233, 39, 0.5)", 
                           highlight: "rgba(218, 233, 39, 1)",                            
                           value: 12500
                       },                        
                       {
                           label: "Asia",
                           color: "rgba(230, 150, 200, 0.5)", 
                           highlight: "rgba(230, 150, 200, 1)",
                           value: 25000
                       },   
                       {
                           label: "West Europe",
                           color: "rgba(200, 220, 50, 0.5)", 
                           highlight: "rgba(200, 220, 50, 1)",
                           value: 18000
                       }                    
                   ];

   var lineSalesByMonth;
   barSalesByPerson = new Chart(ctxSalesByPerson).Bar(dataSalesByPerson);
   pieSalesByRegion = new Chart(ctxSalesByRegion).Doughnut(dataSalesByRegion);

   $("#legendSBP").html(barSalesByPerson.generateLegend());
   $("#legendSBR").html(pieSalesByRegion.generateLegend());

   $(document).ready(function() {

       firebaseRef = new Firebase("https://scorching-fire-224.firebaseio.com");

       var salesRef = firebaseRef.child("sales");

       salesRef.on('value', salesByMonthListener);  

   });

   var salesByMonthListener = function salesByMonthListener(snapshot) {

           var sales;
           var profit;

           dataSalesByMonth.labels = [];
           dataSalesByMonth.datasets[0].data = [];
           dataSalesByMonth.datasets[1].data = [];

           snapshot.forEach(function(salesMonthSnapshot) {
               sales = 0; 
               profit = 0;

               thisMonthName = salesMonthSnapshot.val().month;
               dataSalesByMonth.labels.push(thisMonthName);

               salesMonthSnapshot.forEach(function(salesSnapshot) {
                   if (salesSnapshot.hasChildren()) {
                       sales += salesSnapshot.val().sales; 
                       profit += salesSnapshot.val().profit;   
                   }

               });

               dataSalesByMonth.datasets[0].data.push(sales);
               dataSalesByMonth.datasets[1].data.push(profit);              

           })

           lineSalesByMonth = {};
           lineSalesByMonth = new Chart(ctxSalesByMonth).Line(dataSalesByMonth);
           $("#legendSBM").html(lineSalesByMonth.generateLegend());

       };  

})();

/*(function() {
    
    var firebaseRef;
        
    var ctxSalesByMonth = $("#salesByMonth").get(0).getContext("2d");
    var ctxSalesByPerson = $("#salesByPerson").get(0).getContext("2d");
    var ctxSalesByRegion = $("#salesByRegion").get(0).getContext("2d");
    
    var dataSalesByMonth = {
                        labels : [],
                        datasets: [
                        {
                            label: "Total Sales",
                            fillColor: "rgba(67, 214, 92, 0.5)", 
                            strokeColor: "rgba(67, 214, 92, 1)",
                            pointColor: "rgba(67, 214, 92,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(67, 214, 92,1)",
                            data: []
                        },
                        {
                            label: "Gross Profit",
                            fillColor: "rgba(218, 233, 39, 0.5)", 
                            strokeColor: "rgba(218, 233, 39, 1)",
                            pointColor: "rgba(218, 233, 39,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(218, 233, 39,1)",
                            data: []
                        }                         
                    ]};

    
    var dataSalesByPerson = {
                        labels : ["Bill", "Bob", "Jane", "Judy", "Max", "Holly"],
                        datasets: [
                        {
                            label: "Total Sales",
                            fillColor: "rgba(67, 214, 92, 0.5)", 
                            strokeColor: "rgba(67, 214, 92, 1)",
                            pointColor: "rgba(67, 214, 92,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(67, 214, 92,1)",
                            data: [20000, 25000, 30000, 22000, 28000, 34000]
                        },
                        {
                            label: "Gross Profit",
                            fillColor: "rgba(218, 233, 39, 0.5)", 
                            strokeColor: "rgba(218, 233, 39, 1)",
                            pointColor: "rgba(218, 233, 39,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(218, 233, 39,1)",
                            data: [10000, 12500, 15000, 11000, 14000, 17000]
                        }                         
                    ]};
    
    
    var dataSalesByRegion = [
                        {
                            label: "West USA",
                            color: "rgba(67, 214, 92, 0.5)", 
                            highlight: "rgba(67, 214, 92, 1)",
                            value: 20000
                        },
                        {
                            label: "UK",
                            color: "rgba(218, 233, 39, 0.5)", 
                            highlight: "rgba(218, 233, 39, 1)",                            
                            value: 12500
                        },                        
                        {
                            label: "Asia",
                            color: "rgba(230, 150, 200, 0.5)", 
                            highlight: "rgba(230, 150, 200, 1)",
                            value: 25000
                        },   
                        {
                            label: "West Europe",
                            color: "rgba(200, 220, 50, 0.5)", 
                            highlight: "rgba(200, 220, 50, 1)",
                            value: 18000
                        }                    
                    ];
   
    
    var lineSalesByMonth;
    barSalesByPerson = new Chart(ctxSalesByPerson).Bar(dataSalesByPerson);
    pieSalesByRegion = new Chart(ctxSalesByRegion).Doughnut(dataSalesByRegion);
    
    
    $("#legendSBP").html(barSalesByPerson.generateLegend());
    $("#legendSBR").html(pieSalesByRegion.generateLegend());
    
    $(document).ready(function() {
        
        firebaseRef = new Firebase("https://scorching-fire-224.firebaseio.com");
        
        var salesRef = firebaseRef.child("sales");
        
        salesRef.on('value', salesByMonthListener);  
        
    });
    
    var salesByMonthListener = function salesByMonthListener(snapshot) {
            
            var sales = 0;
            var profit = 0;
            
            dataSalesByMonth.labels = [];
            dataSalesByMonth.datasets[0].data = [];
            dataSalesByMonth.datasets[1].data = [];
            
            snapshot.forEach(function(salesMonth) {
                sales = 0; 
                profit = 0;
                
                thisMonthName = salesMonth.val().month;
                
                dataSalesByMonth.labels.push(thisMonthName);
                
                salesMonth.forEach(function(salesSnap) {
                    if (salesSnap.hasChildren()) {
                        sales += salesSnap.val().sales; 
                        profit += salesSnap.val().profit;   
                    }
              
                });
                    
                
                
                dataSalesByMonth.datasets[0].data.push(sales);
                dataSalesByMonth.datasets[1].data.push(profit);               
                
            })
            
            lineSalesByMonth = {};
            lineSalesByMonth = new Chart(ctxSalesByMonth).Line(dataSalesByMonth);
            $("#legendSBM").html(lineSalesByMonth.generateLegend());
            
        };   
    
})(); */