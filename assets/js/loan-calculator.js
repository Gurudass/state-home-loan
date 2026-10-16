if ($("#loan-calculator-1").length) {
    jQuery(function ($) {

        $("#pricipal-slide").slider({
            range: "min",
            min: 10000,
            max: 5000000,
            value: 1000000,
            step: 1000,
            slide: function (event, ui) {
                $("#pricipal").text(ui.value);
                loancalculate();
            }
        });
        $("#pricipal").text($("#pricipal-slide").slider("value"));

        $("#totalyear-slide").slider({
            range: "min",
            min: 12,
            max: 360,
            step: 6,
            value: 120,
            slide: function (event, ui) {
                $("#totalyear").text(ui.value);
                $("#t_m").text(ui.value);
                loancalculate();
            }
        });
        $("#totalyear").text($("#totalyear-slide").slider("value"));
        $("#t_m").text($("#totalyear-slide").slider("value"));

        $("#intrest-slide").slider({
            range: "min",
            min: 4.10,
            max: 16.20,
            step: 0.01,
            value: 10,
            slide: function (event, ui) {
                $("#intrest").text(ui.value);
                $("#t_ir").text(ui.value);
                loancalculate();
            }
        });
        $("#intrest").text($("#intrest-slide").slider("value"));
        $("#t_ir").text($("#intrest-slide").slider("value"));

        loancalculate();
    });

    //if (typeof(functionName) != 'loancalculate') {

    function loancalculate() {
        var loanAmount = jQuery("#pricipal").text();
        var numberOfMonths = jQuery("#totalyear").text();
        var rateOfInterest = jQuery("#intrest").text();

        var monthlyInterestRatio = (rateOfInterest / 100) / 12;

        var top = Math.pow((1 + monthlyInterestRatio), numberOfMonths);
        var bottom = top - 1;
        var sp = top / bottom;
        var emi = ((loanAmount * monthlyInterestRatio) * sp);
        var full = numberOfMonths * emi;
        var interest = full - loanAmount;
        var int_pge = (interest / full) * 100;
        //$("#tbl_int_pge").html(int_pge.toFixed(2)+" %");
        //$("#tbl_loan_pge").html((100-int_pge.toFixed(2))+" %");

        var emi_str = emi.toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var loanAmount_str = loanAmount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var full_str = full.toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var int_str = interest.toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");


        jQuery("#emi").html(emi_str);
        jQuery("#tbl_emi").html(int_str);
        jQuery("#tbl_la").html(full_str);
    }
    //}
}