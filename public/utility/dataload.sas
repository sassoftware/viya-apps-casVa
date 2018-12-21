/* 
 * Program to load cost table and template output data
 * Recommend you run this from SAS Studio or line-mode SAS.
 */
 
data input_cost; 
input process product $ cost; 
datalines; 
1 choco 15 
1 toffee 40 
2 choco 0 
2 toffee 56.25 
3 choco 18.75 
3 toffee 0 
4 choco 12  
4 toffee 50 
                ; 
run; 
 
cas mycas; 
proc casutil; 
load data=work.input_cost casout='input_cost' outcaslib='public' replace; 
save casdata="input_cost" incaslib="public" ; 
run;

data output_sol;
input product $ Qty;
datalines;
choco 10
toffee 5
;
run;

proc casutil; 
load data=work.output_sol casout='output_sol' outcaslib='public' replace; 
save casdata="output_sol" incaslib="public" ; 
run;



