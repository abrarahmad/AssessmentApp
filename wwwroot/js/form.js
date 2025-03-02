jQuery(function () {
    let controlSetCounter = 0;

    function createControlSet(language, id) {
        return `
            <div class="control-set" id="${language}ControlSet-${id}">
                <div class="form-group">
                    <label class="mb-2" for="${language}Name-${id}">${language} Name</label>
                    <input type="text" class="form-control" id="${language}Name-${id}"  maxlength="50" required>
                </div>
                <div class="form-group">
                    <label class="mb-2" for="${language}Email-${id}">${language} Email</label>
                    <input type="email" class="form-control" id="${language}Email-${id}" maxlength="32" required>
                </div>
                <div class="form-group">
                    <label class="mb-2" for="${language}Phone-${id}">${language} Phone</label>
                    <input type="tel" class="form-control" id="${language}Phone-${id}" maxlength="12" required>
                </div>
                <button type="button" class="btn btn-danger remove-control-set mt-2" data-target="#${language}ControlSet-${id}" style="display: ${language === 'Arabic' && $('input[name="controlOption"]:checked').val() === 'OnlyEnglish' ? 'none' : 'inline-block'};">Remove</button>
            </div>`;
    }

    function addControlSet(language) {
        const controlSetHtml = createControlSet(language, controlSetCounter);
        $(`#${language.toLowerCase()}ControlSets`).append(controlSetHtml);
    }

    function addControlSetsPair() {
        addControlSet("English");
        addControlSet("Arabic");
        controlSetCounter++;
    }

    function removeControlSet(target) {
        $(target).remove();
    }

    $("input[name='controlOption']").on('change', function () {
        const selectedOption = $("input[name='controlOption']:checked").val();
        if (selectedOption === "OnlyEnglish") {
            $("#addArabicControlSet").hide();
            $("#addEnglishControlSet").show();
            $(".remove-control-set[data-target*='ArabicControlSet']").hide();
            $(".remove-control-set[data-target*='EnglishControlSet']").show();
        } else {
            $("#addArabicControlSet").show();
            $("#addEnglishControlSet").show();
            $(".remove-control-set").show();
        }
    });

    $("#addEnglishControlSet").on('click',function () {
        const selectedOption = $("input[name='controlOption']:checked").val();
        if (selectedOption === "OnlyEnglish") {
            addControlSetsPair();
        } else {
            addControlSet("English");
            controlSetCounter++;
        }
    });

    $("#addArabicControlSet").on('click', function () {
        addControlSet("Arabic");
        controlSetCounter++;
    });

    $(document).on("click", ".remove-control-set", function () {
        const targetId = $(this).data("target");
        removeControlSet(targetId);
        const id = targetId.split("-").pop();
        const selectedOption = $("input[name='controlOption']:checked").val();
        if (selectedOption === "OnlyEnglish" && targetId.includes("EnglishControlSet")) {
            removeControlSet(`#ArabicControlSet-${id}`);
        }
    });

    $("#submitForm").on('click', function () {
        let engFormValid = true;
        let arablicFormValid = true;

        $("#englishControlSets input[required]").each(function () {
            if (!this.checkValidity()) {
                engFormValid = false;
                $(this).addClass("is-invalid");
            } else {
                $(this).removeClass("is-invalid");
            }
        });
        $("#arabicControlSets input[required]").each(function () {
            if (!this.checkValidity()) {
                arablicFormValid = false;
                $(this).addClass("is-invalid");
            } else {
                $(this).removeClass("is-invalid");
            }
        });
        if (engFormValid && arablicFormValid) {
            const english = $("#englishControlSets .control-set").map(function () {
                return {
                    name: $(this).find("input[id^='EnglishName']").val(),
                    email: $(this).find("input[id^='EnglishEmail']").val(),
                    phone: $(this).find("input[id^='EnglishPhone']").val()
                };
            }).get();

            const arabic = $("#arabicControlSets .control-set").map(function () {
                return {
                    name: $(this).find("input[id^='ArabicName']").val(),
                    email: $(this).find("input[id^='ArabicEmail']").val(),
                    phone: $(this).find("input[id^='ArabicPhone']").val()
                };
            }).get();
            let formData = {
                english: english,
                arabic: arabic
            };
            if (english.length > 0 || arabic.length > 0) {
                $.ajax({
                    type: "POST",
                    url: "/Home/SubmitForm",
                    data: JSON.stringify(formData),
                    contentType: "application/json",
                    success: function (response) {
                        alert("Submitted successfully!");
                    },
                    error: function (xhr, status, error) {
                        alert("An error occurred while submitting the form: " + error);
                    }
                });
            }
        }
        else {

            if ($('#english-tab.active').length > 0 && engFormValid && !arablicFormValid) {
                $('#arabic-tab').tab('show');
            }
            if ($('#arabic-tab.active').length > 0 && arablicFormValid && !engFormValid) {
                $('#english-tab').tab('show');
            }
            $('input.is-invalid:first').trigger('focus');
        }
    });

    $(document).on('input', 'input[type="tel"]', function () {
        this.value = this.value.replace(/\D/g, '');
    });

});
