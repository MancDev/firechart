(function() {

   var firebaseRef;
   var ctxSalesByMonth; 
   var ctxSalesByPerson; 
   var ctxSalesByRegion;

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

   var dataSalesByRegion = [];                      
               
   var pieColors = [{r: 40, g:80, b:220},
                    {r: 220, g: 100, b: 92},
                    {r: 218, g: 130, b: 39},
                    {r: 230, g: 150, b: 200},
                    {r: 200, g: 240, b: 50},
                    {r: 40, g: 180, b: 120},
                    {r: 180, g: 120, b: 40},
                    {r: 100, g:240, b:80}];

   var lineSalesByMonth;
   var barSalesByPerson;
   var pieSalesByRegion;
     
   $(document).ready(function() {

       firebaseRef = new Firebase("https://scorching-fire-224.firebaseio.com");

       var salesRef = firebaseRef.child("sales");

       salesRef.on('value', salesByMonthListener);  

   });

   var salesByMonthListener = function salesByMonthListener(snapshot) {

           var sales;
           var profit;
           var salesPerson;
           var region;
           var regionObject;
           
            ctxSalesByMonth = $("#salesByMonth").get(0).getContext("2d");
            ctxSalesByPerson = $("#salesByPerson").get(0).getContext("2d");
            ctxSalesByRegion = $("#salesByRegion").get(0).getContext("2d");

           dataSalesByMonth.labels = [];
           dataSalesByPerson.labels = [];
           dataSalesByRegion = [];
           
           dataSalesByMonth.datasets[0].data = [];
           dataSalesByMonth.datasets[1].data = [];
           
           dataSalesByPerson.datasets[0].data = [];
           dataSalesByPerson.datasets[1].data = [];           

           snapshot.forEach(function(salesMonthSnapshot) {
               sales = 0; 
               profit = 0;

               thisMonthName = salesMonthSnapshot.val().month;
               dataSalesByMonth.labels.push(thisMonthName);

               salesMonthSnapshot.forEach(function(salesSnapshot) {
                   if (salesSnapshot.hasChildren()) {
                       var thisSales = salesSnapshot.val().sales;
                       var thisProfit = salesSnapshot.val().profit;
                                              
                       sales += thisSales; 
                       profit += thisProfit;
                          
                       salesPerson = salesSnapshot.val().salesperson;
                       idxSalesPerson = dataSalesByPerson.labels.indexOf(salesPerson);
                       if (idxSalesPerson === -1) {
                           idxSalesPerson = (dataSalesByPerson.labels.push(salesPerson) - 1);
                           dataSalesByPerson.datasets[0].data.push(0);
                           dataSalesByPerson.datasets[1].data.push(0);
                       }
                       dataSalesByPerson.datasets[0].data[idxSalesPerson] += thisSales;
                       dataSalesByPerson.datasets[1].data[idxSalesPerson] += thisProfit;
                       
                       region = salesSnapshot.val().region;
                       idxRegion = findRegion(region, dataSalesByRegion);
                       if (idxRegion === -1) {
                           nxR = dataSalesByRegion.length;  
                           if (nxR > pieColors.length-1) {
                               nxR = 0;
                           }                          
                           regionObject = {
                                            label: region,
                                            color: "rgba(" + pieColors[nxR].r + ", " +
                                                             pieColors[nxR].g + ", " +
                                                             pieColors[nxR].b + ", 0.5)", 
                                            highlight: "rgba(" + pieColors[nxR].r + ", " +
                                                             pieColors[nxR].g + ", " +
                                                             pieColors[nxR].b + ", 1)",
                                            value: 0
                                          }
                           idxRegion = (dataSalesByRegion.push(regionObject) - 1);                                                     
                       }
                       dataSalesByRegion[idxRegion].value += thisSales;                      
                   }

               });

               dataSalesByMonth.datasets[0].data.push(sales);
               dataSalesByMonth.datasets[1].data.push(profit);              

           })

           lineSalesByMonth = {};
           lineSalesByMonth = new Chart(ctxSalesByMonth).Line(dataSalesByMonth);
           $("#legendSBM").html(lineSalesByMonth.generateLegend());
           
           barSalesByPerson = {};
           barSalesByPerson = new Chart(ctxSalesByPerson).Bar(dataSalesByPerson);
           $("#legendSBP").html(barSalesByPerson.generateLegend());  
           
           pieSalesByRegion = {};
           pieSalesByRegion = new Chart(ctxSalesByRegion).Doughnut(dataSalesByRegion); 
           $("#legendSBR").html(pieSalesByRegion.generateLegend());        

       };  
       
       var findRegion = function findRegion(region, regionArray) {
           var result = -1;
           for (var count = 0; count < regionArray.length; count++ ) {          
               if (regionArray[count].label === region) {
                   result = count;
                   break;
               }
           }
           return result;
       }

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