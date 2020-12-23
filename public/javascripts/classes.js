'use strict';
var classes = function () {
    this.initialize = function () {
        this.add()
        this.delete();
        this.get();
        this.edit();
        this.loadCollege();
        this.loadLevels();
    }
    this.loadCollege = function () {
        $.ajax({
            type: "GET",
            url: "/classes/loadCollege",
            dataType: "json",
            success: function (data) {
                for (let obj of data.college) {
                    var div_data = "<option value=" + obj._id + ">" + obj.name + "</option>";
                    $(div_data).appendTo('#addCollege');
                    $(div_data).appendTo('#editCollege');
                }
            }
        });
    }
    this.loadLevels = function () {
        $.ajax({
            type: "GET",
            url: "/classes/loadLevels",
            dataType: "json",
            success: function (data) {
                for (let obj of data.levels) {
                    var div_data = "<option value=" + obj._id + ">" + obj.level + "</option>";
                    $(div_data).appendTo('#addLevels');
                }
            }
        });
    }
    this.add = function () {
        /**
         * this function is use for add representative form validation
         */
        $('form#addClasses').validate({
            errorClass: "errorNum",
            rules: {
                college: {
                    required: true,
                },
                title: {
                    required: true
                },
                class: {
                    required: true
                },
                contactNumber: {
                    required: true,
                    number: true,
                    minlength: 10
                },
                email: {
                    required: true,
                    email: true
                },
                price: {
                    required: true,
                    number: true
                },
                levels: {
                    required: true
                },
                description: {
                    required: true
                },
                syllabus: {
                    required: true,
                    extension: "pdf|doc"
                }
            },
            messages: {
                college: {
                    required: 'Please select college',
                },
                title: {
                    required: 'Please enter title'
                },
                class: {
                    required: 'Please enter class name'
                },
                contactNumber: {
                    required: 'Please enter rep mobile number',
                    minlength: 'Please enter 10 digit mobile number',
                    number: 'Please enter numeric only'
                },
                email: {
                    required: 'Please enter an email',
                    email: 'Please enter a valid email'
                },
                price: {
                    required: 'Please enter price',
                    number: 'Please enter numeric only'
                },
                levels: {
                    required: 'Please enter levels'
                },
                description: {
                    required: 'Please enter description'
                },
                syllabus: {
                    required: 'Please upload a syllabus',
                    extension: 'Please upload only pdf or doc'
                }
            },
            // submitHandler: function (form) {

            // }
        });

        $('#addClasses').on('submit', () => {
            var fd = new FormData();
            fd.append('file', input.files[0]);
            console.log(fd);
            $.ajax({
                url: '/classes',
                dataType: 'json',
                type: 'POST',
                // processData: false,
                data: fd,
                success: function (data) {
                    console.log(data);
                    if (data.type == 'success') {
                        toastr.success(data.message, "Successfully", {
                            progressBar: !0,
                            timeOut: 2e3,
                            showMethod: "slideDown",
                            hideMethod: "slideUp",
                        });
                        // window.location = "/";
                    } else {
                        if (data.type == 'success') {

                            toastr.error(data.error, "Error", {
                                progressBar: !0,
                                timeOut: 2e3,
                                showMethod: "slideDown",
                                hideMethod: "slideUp",
                            });
                            // window.location = "/";
                        }
                    }
                }
            });
            return false;
        })
    }
    this.edit = function () {
        /**
         * this function is use for add representative form validation
         */
        $('form#editClasses').validate({
            errorClass: "errorNum",
            rules: {
                college: {
                    required: true,
                },
                title: {
                    required: true
                },
                class: {
                    required: true
                },
                contactNumber: {
                    required: true,
                    number: true,
                    minlength: 10
                },
                email: {
                    required: true,
                    email: true
                },
                price: {
                    required: true,
                    number: true
                },
                levels: {
                    required: true
                },
                description: {
                    required: true
                },
                syllabus: {
                    required: true,
                    extension: "pdf|doc"
                }
            },
            messages: {
                college: {
                    required: 'Please select college',
                },
                title: {
                    required: 'Please enter title'
                },
                class: {
                    required: 'Please enter class name'
                },
                contactNumber: {
                    required: 'Please enter rep mobile number',
                    minlength: 'Please enter 10 digit mobile number',
                    number: 'Please enter numeric only'
                },
                email: {
                    required: 'Please enter an email',
                    email: 'Please enter a valid email'
                },
                price: {
                    required: 'Please enter price',
                    number: 'Please enter numeric only'
                },
                levels: {
                    required: 'Please enter levels'
                },
                description: {
                    required: 'Please enter description'
                },
                syllabus: {
                    required: 'Please upload a syllabus',
                    extension: 'Please upload only pdf or doc'
                }
            },
            // submitHandler: function (form) {
            // }

        });
        $("#editClasses").on("submit", () => {
            var fd = new FormData();
            fd.append('file', input.files[0]);
            console.log(fd);
            $.ajax({
                url: '/classes/' + $(this).data("id"),
                dataType: 'json',
                type: 'PUT',
                // processData: false,
                data: fd,
                success: function (data) {
                    console.log(data);
                    if (data.type == 'success') {
                        toastr.success(data.message, "Successfully", {
                            progressBar: !0,
                            timeOut: 2e3,
                            showMethod: "slideDown",
                            hideMethod: "slideUp",
                        });
                        // window.location = "/";
                    } else {
                        if (data.type == 'success') {

                            toastr.error(data.error, "Error", {
                                progressBar: !0,
                                timeOut: 2e3,
                                showMethod: "slideDown",
                                hideMethod: "slideUp",
                            });
                            // window.location = "/";
                        }
                    }
                }
            });
            return false;
        })
    }
    /**
     * this function is to Delete class
     */
    this.delete = function () {
        $(".delete").on("click", function () {
            let url = '/classes/' + $(this).data('id');
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
                    $.ajax({
                        url,
                        type: 'DELETE'
                    }, {}, function (data) {
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

    this.get = function () {
        $(".edit").on("click", function () {
            // console.log($(this).data('id'));
            let url = '/classes/' + $(this).data('id');

            $.ajax({
                url,
                type: "GET",
                cache: false,
                processData: false,
                success: function (data) {
                    console.log(data);
                    $('#editClassesModal').modal('show');
                    $("#editCollege").val(data.classR.college)
                    for (const lev of data.classR.levels) {
                        $("#editLevels").val(lev.level)
                    }
                    $("#editTitle").val(data.classR.title)
                    $("#editClass").val(data.classR.class)
                    $("#editDescription").val(data.classR.description)
                    $("#editContactNumber").val(data.classR.contactNumber)
                    $("#editEmail").val(data.classR.email)
                    $("#editPrice").val(data.classR.price)
                }
            });
            // $.ajax({
            //     url,
            //     type: "GET"
            // }, {}, function (data) {
            //     console.log(data);
            //     //Ajax get request
            //     if (data.type == 'success') {
            //         //successfully response
            //         $("#title").val(data.title)
            //     } else {
            //         //Error
            //         swal({
            //             title: 'Error!',
            //             text: data.message,
            //             type: 'error',
            //             confirmButtonClass: 'btn-default',
            //         });
            //     }
            // });
            return false;
        })
    }
    this.initialize();
    var _this = this;
}