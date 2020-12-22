'use strict';
var classes = function () {
    this.initialize = function () {
        this.add()
        this.delete();
        this.edit();
        this.loadCollege();
    }
    this.loadCollege = function () {
        
    }
    this.add = function () {
        /**
         * this function is use for add representative form validation
         */
        $('form#addEmployee').validate({
            errorClass: "errorNum",
            rules: {
                college: {
                    required: true,
                },
                title: {
                    required: true
                },
                contactNumber: {
                    required: true,
                    minlength: 10
                },
                email: {
                    required: true,
                    email: true
                },
                price: {
                    required: true
                },
                levels:{
                    required: true
                },
                description:{
                    required: true
                },
                syllabus:{
                    required: true
                }
            },
            messages: {
                college: {
                    required: 'Please select college',
                },
                title:{
                    message: 'Please enter title'
                },
                contactNumber: {
                    required: 'Please enter rep mobile number',
                    minlength: 'Please enter 10 digit mobile number'
                },
                email: {
                    required: 'Please enter an email',
                    email: 'Please enter a valid email'
                },
                price: {
                    required: 'Please enter price'
                },
                levels: {
                    required: 'Please enter levels'
                },
                description:{
                    required: 'Please enter description'
                },
                syllabus:{
                    required: 'Please upload a syllabus'
                }
            },
            submitHandler: function (form) {
                $(form).ajaxSubmit({
                    dataType: 'json',
                    processData: false,
                    data: {
                        number_with_code: countryCodeVar.getNumber()
                    },
                    success: function (data) {
                        if (data.type == 'success') {
                            //Load list page
                            window.location.href = "/classes/list"
                        }
                    }
                });
                return false;
            }
        });
    }
    /**
     * this function is to Delete class
     */
    this.delete = function () {
        $(".delete").on("click", function () {
            let url = $(this).attr('href');
            //Sweat alert for confirmation
            swal({
                title: 'Are you sure?',
                text: 'You want to delete class!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn-primary',
                confirmButtonText: 'Yes, Remove it',
                cancelButtonText: 'Cancel',
            }).then(function (isConfirm) {
                //If user agree
                if (isConfirm) {
                    $.get(url, {}, function (data) {
                        //Ajax get request
                        if (data.type == 'success') {
                            //successfully response
                            swal({
                                title: 'Removed!',
                                text: data.message,
                                type: 'success',
                                confirmButtonClass: 'btn-success',
                                allowOutsideClick: false
                            }).then(function (isConfirm) {
                                if (isConfirm) {
                                    location.href = "/classes/list";
                                }
                            });
                        } else {
                            //Error
                            swal({
                                title: 'Error!',
                                text: data.message,
                                type: 'error',
                                confirmButtonClass: 'btn-default',
                            });
                        }
                    });
                } else {
                   
                    swal({
                        title: 'Cancelled',
                        text: 'You cancelled operation :)',
                        type: 'error',
                        confirmButtonClass: 'btn-default',
                    })
                }
            }).catch(swal.noop)
            return false;
        })
    }
    this.initialize();
    var _this = this;
}