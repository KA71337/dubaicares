var ccmFormidableAddressStates = "";
var ccmFormidableUploaders = [];
var ccmFormidableErrorReporting = "inline";
var ccmFormidableDependencyFirstLoad = true;

$(function () {
	ccmFormidableInitialize();
	$(window).resize(function () {
		ccmFormidableTooltip();
		ccmFormidableResolution();
	});
});

ccmFormidableInitialize = function (formObj) {
	ccmFormidableTooltip();
	ccmFormidableResolution();
	//ccmFormidableShowMessages()

	if (formObj == undefined) formObj = $("body");

	$(".counter", formObj)
		.closest(".element")
		.find("input, textarea")
		.each(function () {
			if ($(this).hasClass("counter_disabled"))
				$(this).closest(".element").find(".counter").parent().remove();
			else {
				var counter = $("#" + $(this).attr("id") + "_count");
				var type = $("#" + $(this).attr("id") + "_counter").attr("type");
				var max = $("#" + $(this).attr("id") + "_counter").attr("max");
				if (type == "value")
					max = $("#" + $(this).attr("id") + "_counter").attr("max").length;
				if (type == "tags") {
					var current = $(this).next("div.tagsinput").find("span.tag").length;
					counter.text(max - current);
				} else if (type == "files") {
					var current = $(this)
						.closest("fieldset")
						.find("ul.ax-file-list li").length;
					counter.text(max - current);
				} else {
					$(this).simplyCountable({
						counter: counter,
						countType: type,
						maxCount: max,
						strictMax: true,
					});
				}
			}
		});

	$("select", formObj)
		.find('option[value="option_other"]:selected')
		.each(function () {
			$(this).closest(".element").find("div.option_other").slideDown();
		});
	$("select", formObj).change(function () {
		if ($(this).find('option[value="option_other"]:selected').length > 0)
			$(this).closest(".element").find("div.option_other").slideDown();
		else $(this).closest(".element").find("div.option_other").slideUp();
	});

	$('input[type="range"]', formObj).change(function () {
		$(this).closest(".element").find("input[type=hidden]").val($(this).val());
		$(this)
			.closest(".element")
			.find("span:not(.no_counter)")
			.text($(this).val());
		$(this)
			.removeClass("error")
			.closest(".element")
			.find("div.error")
			.fadeOut();
	});

	$('input[value="option_other"]:checked', formObj).each(function () {
		$(this).closest(".element").find("div.option_other").slideDown();
	});
	$("input[type=radio]", formObj).click(function () {
		if ($(this).val() == "option_other")
			$(this).closest(".element").find("div.option_other").slideDown();
		else $(this).closest(".element").find("div.option_other").slideUp();
	});

	$('input[type="checkbox"]', formObj).click(function () {
		var closed = true;
		$(this)
			.closest(".element")
			.find('input[type="checkbox"]:checked')
			.each(function () {
				if ($(this).val() == "option_other") closed = false;
			});
		if (!closed)
			$(this).closest(".element").find("div.option_other").slideDown();
		else $(this).closest(".element").find("div.option_other").slideUp();
	});

	$('input[type="radio"].stars', formObj).rating();

	$("input[placeholder], textarea[placeholder]", formObj).addPlaceholder();

	if (typeof ccmFormidableAddressStatesTextList !== "undefined")
		ccmFormidableAddressStates = ccmFormidableAddressStatesTextList.split("|");

	$(
		'form[name="formidable_form"] input[type="submit"], form[name="formidable_form"] input[type="button"]',
		formObj,
	).on("click", function (e) {
		e.preventDefault();
		ccmFormidableSubmitForm($(this).closest("form"), $(this).attr("id"));
	});

	$('input:not([type="file"]), textarea, select', formObj).bind(
		"keyup, keydown, change",
		function () {
			$(this)
				.removeClass("error")
				.closest(".element")
				.find("div.error")
				.fadeOut();
		},
	);
	$('input[type="checkbox"], input[type="radio"]', formObj).bind(
		"click",
		function () {
			$(this)
				.removeClass("error")
				.closest(".element")
				.find("div.error")
				.fadeOut();
		},
	);

	$('input[name="ccmCaptchaCode"]', formObj).attr("id", "ccmCaptchaCode");

	$('input[type="radio"]', formObj).bind("click", function () {
		$('input[name="' + $(this).attr("name") + '"]')
			.not($(this))
			.trigger("deselect");
	});
};

function ccm_t_ff(s, v) {
	return I18N_FF && I18N_FF[s] ? I18N_FF[s].replace("%s", v) || s : s;
}

ccmFormidableAddElement = function (name, value, parent) {
	$(parent)
		.find("input[id=" + name + "]")
		.remove();
	$(parent).append(
		$("<input>").attr({ name: name, id: name, value: value, type: "hidden" }),
	);
};

ccmFormidableResolution = function () {
	$("input[id=resolution]").each(function () {
		$(this).val(screen.width + "x" + screen.height);
	});
};

ccmFormidableTooltip = function () {
	$("[rel^=tooltip_]").each(function () {
		var tooltip = $("#" + $(this).attr("rel")).html();
		var element = $(this);
		if (element.attr("type") == "radio" || element.attr("type") == "checkbox") {
			element = element.parent();
		}
		element.qtip({
			content: { text: tooltip, prerender: false },
			position: {
				adjust: { y: -10, x: -1 },
				my: "bottom left",
				at: "top left",
			},
			title: false,
			show: { event: "mouseenter focus" },
			hide: { event: "mouseleave blur" },
			style: { tip: false, classes: "qtip-light", width: element.outerWidth() },
		});
	});
};

ccmFormidableSubmitForm = function (formObj, action) {
	var errors = [];

	ccmFormidableAddElement("action", action, formObj);

	if (typeof tinyMCE == "object") tinyMCE.triggerSave();

	var formID = formObj.find("input[id=formID]").val();

	var data = formObj.serialize();
	var extra_data = ccmFormidableGetUploaderData(formObj);
	if (!!extra_data) data += extra_data;

	$.ajax({
		type: "POST",
		url: tools_url,
		data: data,
		beforeSend: function () {
			ccmFormidablePleaseWait(formObj);
		},
		success: function (data) {
			scrollToObject(formObj);

			if (typeof data != "object") {
				formObj
					.closest('div[id^="formidable_container_"]')
					.replaceWith(data)
					.trigger("create");
				var newFormObj = $("#formidable_container_" + formID);
				ccmFormidableShowMessages(newFormObj);
				ccmFormidableInitialize(newFormObj);
				ccmFormidablePleaseWait(newFormObj);
			} else {
				var bootstrap = false;
				if (
					formObj
						.closest('div[id^="formidable_container_"]')
						.hasClass("bootstrap")
				)
					bootstrap = true;

				if (data.message) {
					var messages = [];
					formObj.find(".error:not(div)").removeClass("error");
					if (bootstrap) formObj.find(".has-error").removeClass("has-error");
					$.each(data.message, function (i, row) {
						messages.push($("<div>").html(row.message));
						eObj = $(
							'[id="' +
								row.handle +
								'"],[name="' +
								row.handle +
								'[]"],[name^="' +
								row.handle +
								'["],[data-uploadername=' +
								row.handle +
								"]",
						);
						if (eObj.length > 0) {
							$(
								'[id="' +
									row.handle +
									'"],[id="' +
									row.handle +
									'_confirm"],[name="' +
									row.handle +
									'[]"],[name^="' +
									row.handle +
									'["]',
							).addClass("error");
							if (bootstrap)
								formObj
									.find(".error:not(div)")
									.closest(".form-group")
									.addClass("has-error");
							if (ccmFormidableErrorReporting == "inline") {
								pObj = eObj.closest(".element");
								pObj.find("div.error").remove();
								var cls = pObj.children(".input").attr("class");
								if (!!cls) cls.replace("input", "");
								var err = $("<div>")
									.addClass("error " + cls)
									.text(row.message);
								if (bootstrap) err.addClass("col-sm-offset-2");
								pObj.append(err);
							}
						}
					});
					ccmFormidableShowMessages(formObj, messages);
					ccmFormidableTriggerCaptchaClick();
				} else if (data.redirect) window.location.href = data.redirect;
			}
		},
	});

	return false;
};

ccmFormidableTagsCounter = function (fObj) {
	if (fObj) {
		var cObj = $("span[id=" + fObj.attr("id") + "_count]");
		if (cObj) {
			var current_tags = parseInt(
				fObj.next(".tagsinput").find("span.tag").length,
			);
			var max_tags = parseInt(cObj.parent(".counter").attr("max"));
			cObj.text(max_tags - current_tags);
		}
	}
};

ccmFormidableUploaderInit = function (uploaderID) {
	var fObj = $("#formidable_uploader_" + uploaderID);
	var allowed_ext = [];
	if (fObj) {
		if (!!fObj.attr("data-allowed_extensions")) {
			$.each(fObj.attr("data-allowed_extensions").split(","), function () {
				allowed_ext.push($.trim(this));
			});
		}
		fObj.ajaxupload({
			url: tools_url,
			flash: package_url + "/libraries/3rdparty/ajaxupload/uploader.swf",
			data: function () {
				return {
					eID: uploaderID,
					action: "upload",
					ccm_token: fObj.attr("data-ccm_token"),
				};
			},
			//dropColor: 'red',
			//dropArea: '#formidable_uploader_'+uploaderID+'_drop',
			language: fObj.attr("data-language"),
			removeOnError: true,
			autoStart: true,
			chunkSize: 1048576, // 0 for no chucks
			maxFiles:
				parseInt(fObj.attr("data-max_files")) -
				parseInt(fObj.attr("data-current_files")),
			allowExt: allowed_ext.length > 0 ? allowed_ext : "",
			error: function (errors, files) {
				ccmFormidableUploaderError(fObj, errors);
			},
			finish: function (filenames, files) {
				ccmFormidableUploaderCheck(fObj);
			},
			onSelect: function () {
				ccmFormidableUploaderCounter(fObj);
			},
			validateFile: function (file, extension, size) {
				return ccmFormidableUploaderValidator(fObj, extension);
			},
			onInit: function () {
				ccmFormidableUploaderLoad(fObj);
			},
		});
	}
};

ccmFormidableUploaderCheck = function (fObj, formObj) {
	if (formObj) var formID = formObj.find("input[id=formID]").val();

	if (fObj) {
		var formID = fObj
			.closest('form[id^="ff_"]')
			.find("input[name=formID]")
			.val();
		var pos = $.inArray(
			fObj.attr("data-uploaderid"),
			ccmFormidableUploaders[formID],
		);
		if (pos !== -1)
			ccmFormidableUploaders[formID] = removeKey(
				ccmFormidableUploaders[formID],
				pos,
			);
	}

	if (!formObj) var formObj = $('form[id="ff_' + formID + '"]');
	ccmFormidablePleaseWait(formObj, true);

	if (!!ccmFormidableUploaders[formID]) {
		for (var i = 0; i < ccmFormidableUploaders[formID].length; i++) {
			var fObj = $("#formidable_uploader_" + ccmFormidableUploaders[formID][i]);
			if (fObj) {
				if (fObj.ajaxupload("getFiles").length <= 0) {
					ccmFormidableUploaders[formID] = removeKey(
						ccmFormidableUploaders[formID],
						i,
					);
				}
			}
		}
	}
	if (ccmFormidableUploaders[formID].length <= 0) {
		var upload_data = ccmFormidableGetUploaderData(formObj);
		ccmFormidablePleaseWait(formObj);
	}
};

ccmFormidableUploaderValidator = function (fObj, extension) {
	var allowed_ext = [];
	if (!extension) return ccm_t_ff("Extension not allowed", extension);

	if (fObj) {
		fObj
			.find(".ax-text")
			.removeClass("error")
			.closest(".element")
			.find("div.error")
			.fadeOut();
		ccmFormidablePleaseWait(fObj.closest("form"), true);
		if (!!fObj.attr("data-allowed_extensions")) {
			$.each(fObj.attr("data-allowed_extensions").split(","), function () {
				allowed_ext.push($.trim(this));
			});
		}
		if (!!fObj.attr("data-allowed_global_extensions")) {
			$.each(
				fObj.attr("data-allowed_global_extensions").split(","),
				function () {
					allowed_ext.push($.trim(this));
				},
			);
		}
		if (allowed_ext.length > 0) {
			if ($.inArray(extension, allowed_ext) < 0) {
				ccmFormidablePleaseWait(fObj.closest("form"));
				return ccm_t_ff("Extension not allowed", extension);
			}
		}
	}
};

ccmFormidableUploaderLoad = function (fObj) {
	if (fObj) {
		var formID = fObj
			.closest('form[id^="ff_"]')
			.find("input[name=formID]")
			.val();
		if (!ccmFormidableUploaders[formID]) ccmFormidableUploaders[formID] = [];
		ccmFormidableUploaders[formID].push(fObj.attr("data-uploaderid"));
		fObj.find(".ax-button span:not(.ax-icon, .ax-clear)").addClass("btn");
		var allowed_ext =
			fObj.attr("data-allowed_extensions") != ""
				? fObj.attr("data-allowed_extensions")
				: "";
		if (allowed_ext != "")
			if ($("body.ar").length > 0) {
				fObj
					.find(".ax-clear")
					.after(
						$("<div>")
							.addClass("ax-extensions")
							.html(ccm_t_ff("نوع الملفات المسموح بها")),
					);
			} else {
				fObj.find(".ax-clear").after(
					$("<div>")
						.addClass("ax-extensions")
						.html(ccm_t_ff("Allowed extensions") + ": " + allowed_ext),
				);
			}

		ccmFormidableUploaderCounter(fObj, true);
	}
};
ccmFormidableUploaderCounter = function (fObj, first_load) {
	if (fObj) {
		fObj.find("a.ax-remove").click(function () {
			ccmFormidableUploaderCounter(fObj);
		});
		var cObj = $("span[id=" + fObj.attr("data-uploaderName") + "_count]");
		if (cObj) {
			var selected_files = 0;
			if (first_load !== true)
				var selected_files = fObj.ajaxupload("getFiles").length;
			var current_files = parseInt(fObj.attr("data-current_files"));
			var max_files = parseInt(fObj.attr("data-max_files"));
			cObj.text(max_files - current_files - selected_files);
		}
	}
};
ccmFormidableGetUploaderData = function (formObj) {
	if (formObj) {
		var uploaders = formObj.find("div.ccm_formidable_upload");
		if (!!uploaders) {
			var data = "";
			for (var i = 0; i < uploaders.length; i++) {
				var tmpf = [];
				var fObj = $(uploaders[i]);
				var files = $(
					"div[id=formidable_uploader_" + fObj.attr("data-uploaderid") + "]",
				).ajaxupload("getFiles");
				if (!!files) {
					for (var f = 0; f < files.length; f++) {
						data +=
							"&" +
							fObj.attr("data-uploadername") +
							"[" +
							f +
							"][name]=" +
							files[f]["name"];
						data +=
							"&" +
							fObj.attr("data-uploadername") +
							"[" +
							f +
							"][ext]=" +
							files[f]["ext"];
						data +=
							"&" +
							fObj.attr("data-uploadername") +
							"[" +
							f +
							"][size]=" +
							files[f]["size"];
						data +=
							"&" +
							fObj.attr("data-uploadername") +
							"[" +
							f +
							"][status]=" +
							files[f]["status"];
					}
				}
			}
			return data;
		}
	}
	return false;
};
ccmFormidableUploaderDropFile = function (uploaderID, fileID) {
	var fObj = $("div[id=formidable_uploaded_files_" + uploaderID + "]");
	if (fObj) {
		fObj.find("li[id=file_" + fileID + "]").remove();
		if (fObj.find("li").length <= 0) fObj.remove();
	}
	var fObj = $("div[id=formidable_uploader_" + uploaderID + "]");
	if (fObj) {
		fObj.attr(
			"data-current_files",
			parseInt(fObj.attr("data-current_files")) - 1,
		);
		ccmFormidableUploaderSetOption(
			fObj,
			"maxFiles",
			parseInt(fObj.attr("data-max_files")) -
				parseInt(fObj.attr("data-current_files")),
		);
		ccmFormidableUploaderCounter(fObj);
		var files = ccmFormidableGetUploaderData(fObj.closest("form"));
		//ccmFormidablePleaseWait(fObj.closest('form'));
	}
};

ccmFormidableUploaderError = function (fObj, err) {
	if (fObj) {
		var error = [];
		if (err.length > 0) {
			if (err.indexOf(":") != -1) error = err.split(":");
			else error[0] = err;
		}
		if (error.length > 0) {
			var formObj = fObj.closest('form[id^="ff_"]');
			fObj.find(".ax-text").addClass("error");
			if (ccmFormidableErrorReporting == "inline") {
				var _err =
					"<div class='error'>" + ccm_t_ff(error[0], error[1]) + "</div>";
				fObj.find("ul.ax-file-list").before(_err.replace(/"/g, "&quot;"));
			}
			ccmFormidableShowMessages(
				formObj,
				[$("<div>").html(ccm_t_ff(error[0], error[1]))],
				false,
			);
		}
		ccmFormidableUploaderCheck(fObj);
	}
};

ccmFormidableUploaderSetOption = function (fObj, opt_name, opt_value) {
	if (fObj) fObj.ajaxupload("option", opt_name, opt_value);
};

ccmFormidableUploaderGetOption = function (fObj, opt_name) {
	if (fObj) return fObj.ajaxupload("option", opt_name);
};

ccmFormidableShowMessages = function (formObj, messages, loader) {
	var formID = formObj.find("input[name=formID]").val();
	var msgObj = formObj.parent().find("div[id=ff_msg_" + formID + "]");

	if (ccmFormidableErrorReporting != "inline") {
		if (msgObj.length > 0) msgObj.empty();
		else
			msgObj = $("<div>")
				.attr("id", "ff_msg_" + formID)
				.hide()
				.addClass("formidable_message error")
				.prependTo(formObj.parent());

		if (!!messages) {
			$.each(messages, function (i, row) {
				msgObj.append(row);
			});
			msgObj.show();
			scrollToObject(msgObj);
		} else msgObj.hide();
	}

	if (loader !== false) ccmFormidablePleaseWait(formObj);
};

ccmFormidableTriggerCaptchaClick = function () {
	var imgObj = $("img.ccm-captcha-image");
	if (!!imgObj.length) imgObj.trigger("click");
	$("input[name=ccmCaptchaCode]").val("");
};

ccmFormidableAddressSelectCountry = function (cls, country) {
	var ss = $('select[id="' + cls + '[province]"]');
	var si = $('input[id="' + cls + '[province]"]');

	var foundStateList = false;
	ss.html("");
	if (ccmFormidableAddressStates) {
		for (j = 0; j < ccmFormidableAddressStates.length; j++) {
			var sa = ccmFormidableAddressStates[j].split(":");

			if (jQuery.trim(sa[0]) == country) {
				if (!foundStateList) {
					foundStateList = true;
					si.attr(
						"name",
						"inactive_" + si.attr("ccm-attribute-address-field-name"),
					);
					si.hide();
					ss.append(
						'<option value="">' +
							ccm_t_ff("Choose State/Province") +
							"</option>",
					);
				}
				ss.show();
				ss.attr("name", si.attr("ccm-attribute-address-field-name"));
				ss.append(
					'<option value="' +
						jQuery.trim(sa[1]) +
						'">' +
						jQuery.trim(sa[2]) +
						"</option>",
				);
			}
		}
		if (ss.attr("ccm-passed-value") != "") {
			$(function () {
				ss.find("option[value=" + ss.attr("ccm-passed-value") + "]").attr(
					"selected",
					true,
				);
			});
		}
	}
	if (!foundStateList) {
		ss.attr("name", "inactive_" + si.attr("ccm-attribute-address-field-name"));
		ss.hide();
		si.show();
		si.attr("name", si.attr("ccm-attribute-address-field-name"));
	}
};

ccmFormidableAddressSetupStateProvinceSelector = function (cls) {
	var cs = $('select[id="' + cls + '[country]"]');
	cs.change(function () {
		var v = $(this).val();
		ccmFormidableAddressSelectCountry(cls, v);
	});
	if (cs.attr("ccm-passed-value") != "") {
		$(function () {
			cs.find("option[value=" + cs.attr("ccm-passed-value") + "]").attr(
				"selected",
				true,
			);
			ccmFormidableAddressSelectCountry(cls, cs.attr("ccm-passed-value"));
			var ss = $('select[id="' + cls + '[province]"]');
			if (ss.attr("ccm-passed-value") != "") {
				ss.find("option[value=" + ss.attr("ccm-passed-value") + "]").attr(
					"selected",
					true,
				);
			}
		});
	}
	ccmFormidableAddressSelectCountry(cls, "");
};

ccmFormidablePleaseWait = function (formObj, forceWait) {
	if (!forceWait) forceWait = false;

	if (formObj) {
		var _submit = formObj.find("input[type=submit]");
		var _button = formObj.find("input[type=button]");
		var _loader = formObj.find("div.please_wait_loader");
		if (_submit.hasClass("please_wait")) {
			if (forceWait) return;
			_submit
				.val(_submit.attr("data-value"))
				.attr({ disabled: false })
				.removeClass("please_wait");
			_loader.hide();
			_button.attr({ disabled: false }).removeClass("please_wait");
		} else {
			_submit
				.attr({
					"data-value": _submit.val(),
					disabled: true,
					value: ccm_t_ff("Please wait..."),
				})
				.addClass("please_wait");
			_loader.css({ display: "inline-block" });
			_button.attr({ disabled: true }).addClass("please_wait");
		}
	}
};

ccmFormidableDependencyChange = function (selector, arguments) {
	//if (ccmFormidableDependencyFirstLoad == false) {
	//	ccmFormidableDependencyFirstLoad = true;
	//	return false;
	//}

	var eObj = $('[name="' + selector + '"]');
	if (!eObj.length) eObj = $('[name^="' + selector + '["]');
	if (!eObj.length) eObj = $('[id="' + selector + '"]');

	if (eObj.length <= 0) return false;

	var tagName = eObj.get(0).tagName.toLowerCase();
	var typeName = eObj.attr("type");

	for (var i = 0; i < arguments.length; i++) {
		switch (arguments[i][0]) {
			case "disable":
				eObj.attr("disabled", true);
				break;

			case "enable":
				eObj.attr("disabled", false);
				break;

			case "show":
				if (eObj.closest(".element").length > 0)
					eObj.closest(".element").show();
				else eObj.show();
				break;

			case "hide":
				if (eObj.closest(".element").length > 0)
					eObj.closest(".element").hide();
				else eObj.hide();

				break;

			case "value":
				if (
					tagName == "input" ||
					tagName == "textarea" ||
					tagName == "select"
				) {
					if (typeName == "checkbox" || typeName == "radio") {
						var _argument = arguments[i][1];
						eObj.each(function (j, eObjItem) {
							if ($(eObjItem).val() == _argument)
								$(eObjItem).attr("checked", false).trigger("click");
						});
					} else {
						eObj.val(arguments[i][1]).trigger("change");
					}
				}
				break;

			case "class":
				eObj.removeClass(arguments[i][1]);
				if (arguments[i][2] == "add") eObj.addClass(arguments[i][1]);
				break;
		}
	}
};

function removeKey(arrayName, key) {
	var x;
	var tmpArray = new Array();
	for (x in arrayName) if (x != key) tmpArray[x] = arrayName[x];
	return tmpArray;
}

function scrollToObject(obj) {
	if ($(obj).length > 0 && $(obj).height() > 0) {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
		// var window_height = $(window).height();
		// var scroll_position = $(window).scrollTop();
		// var element_position = $(obj).position().top;
		// var element_height = $(obj).height();
		// console.log("here - " + $(obj).offset().top);
		// if (
		// 	element_position < scroll_position ||
		// 	scroll_position + window_height < element_position + element_height
		// )
		// 	$("html,body").animate({ scrollTop: $(obj).offset().top }, "slow");
	}
}

/*!
 * 'addPlaceholder' Plugin for jQuery
 *
 * @author Ilia Draznin
 * @link http://iliadraznin.com/2011/02/jquery-placeholder-plugin/
 * @created 19-02-2011
 * @updated 06-04-2011
 * @version 1.0.3
 *
 * Description:
 * jQuery plugin that adds "placeholder" functionality (like in Chrome) to browsers that
 * don't support it natively (like Firefox 3.6 or lower, or IE naturally)
 *
 * Usage:
 * $(selector).addPlaceholder(options);
 */
(function (d) {
	var g = document.createElement("input");
	d.extend(d.support, { placeholder: !!("placeholder" in g) });
	d.fn.addPlaceholder = function (g) {
		function h(a, c) {
			if (f(a.val()) || a.val() == c) a.val(c), a.addClass(b["class"]);
			a.focusin(function () {
				a.hasClass(b["class"]) && (a.removeClass(b["class"]), a.val(""));
			});
			a.focusout(function () {
				f(a.val()) && (a.val(c), a.addClass(b["class"]));
			});
		}
		function i(a, c) {
			a.addClass(b["class"]);
			var e = d("<span/>", {
				class: a.attr("class") + " " + b["class"],
				text: c,
				css: {
					border: "none",
					cursor: "text",
					background: "transparent",
					position: "absolute",
					top: a.position().top,
					left: a.position().left,
					lineHeight: a.height() + 3 + "px",
					paddingLeft: parseFloat(a.css("paddingLeft")) + 2 + "px",
				},
			}).insertAfter(a);
			a.focusin(function () {
				a.hasClass(b["class"]) && (e.hide(), a.removeClass(b["class"]));
			});
			a.focusout(function () {
				f(a.val()) && (e.show(), a.addClass(b["class"]));
			});
			b.checkafill &&
				(function j() {
					!f(a.val()) && a.hasClass(b["class"]) && a.focusin();
					setTimeout(j, 250);
				})();
		}
		function f(a) {
			return b.allowspaces ? a === "" : d.trim(a) === "";
		}
		var b = {
			class: "placeholder",
			allowspaces: !1,
			dopass: !0,
			dotextarea: !0,
			checkafill: !1,
		};
		return this.each(function () {
			if (d.support.placeholder) return !1;
			d.extend(b, g);
			if (
				!(
					this.tagName.toLowerCase() == "input" ||
					(b.dotextarea && this.tagName.toLowerCase() == "textarea")
				)
			)
				return !0;
			var a = d(this),
				c = this.getAttribute("placeholder"),
				e = a.is("input[type=password]");
			if (!c) return !0;
			b.dopass && e ? i(a, c) : e || h(a, c);
		});
	};
})(jQuery);

/*!
 * qTip2 - Pretty powerful tooltips - v2.0.1
 * http://qtip2.com
 *
 * Copyright (c) 2012 Craig Michael Thompson
 * Released under the MIT, GPL licenses
 * http://jquery.org/license
 *
 * Date: Mon Dec 31 2012 02:55 GMT+0000
 * Plugins: svg ajax tips modal viewport imagemap ie6
 * Styles: basic css3
 */

(function (b, a, c) {
	(function (d) {
		if (typeof define === "function" && define.amd) {
			define(["jquery"], d);
		} else {
			if (jQuery && !jQuery.fn.qtip) {
				d(jQuery);
			}
		}
	})(function (A) {
		var u = true,
			N = false,
			w = null,
			e = "x",
			d = "y",
			g = "width",
			z = "height",
			C = "top",
			r = "left",
			y = "bottom",
			O = "right",
			x = "center",
			n = "flip",
			H = "flipinvert",
			D = "shift",
			J,
			v,
			E,
			h = "qtip",
			k = {},
			B = ["ui-widget", "ui-tooltip"],
			j = "div.qtip." + h,
			G = h + "-default",
			M = h + "-focus",
			m = h + "-hover",
			o = "_replacedByqTip",
			l = "oldtitle",
			L;
		function F(P) {
			E = {
				pageX: P.pageX,
				pageY: P.pageY,
				type: "mousemove",
				scrollX:
					b.pageXOffset || a.body.scrollLeft || a.documentElement.scrollLeft,
				scrollY:
					b.pageYOffset || a.body.scrollTop || a.documentElement.scrollTop,
			};
		}
		function t(P) {
			var Q = function (S) {
					return S === w || "object" !== typeof S;
				},
				R = function (S) {
					return (
						!A.isFunction(S) &&
						((!S && !S.attr) ||
							S.length < 1 ||
							("object" === typeof S && !S.jquery && !S.then))
					);
				};
			if (!P || "object" !== typeof P) {
				return N;
			}
			if (Q(P.metadata)) {
				P.metadata = { type: P.metadata };
			}
			if ("content" in P) {
				if (Q(P.content) || P.content.jquery) {
					P.content = { text: P.content };
				}
				if (R(P.content.text || N)) {
					P.content.text = N;
				}
				if ("title" in P.content) {
					if (Q(P.content.title)) {
						P.content.title = { text: P.content.title };
					}
					if (R(P.content.title.text || N)) {
						P.content.title.text = N;
					}
				}
			}
			if ("position" in P && Q(P.position)) {
				P.position = { my: P.position, at: P.position };
			}
			if ("show" in P && Q(P.show)) {
				P.show = P.show.jquery ? { target: P.show } : { event: P.show };
			}
			if ("hide" in P && Q(P.hide)) {
				P.hide = P.hide.jquery ? { target: P.hide } : { event: P.hide };
			}
			if ("style" in P && Q(P.style)) {
				P.style = { classes: P.style };
			}
			A.each(v, function () {
				if (this.sanitize) {
					this.sanitize(P);
				}
			});
			return P;
		}
		function f(ao, S, ag, ah) {
			var af = this,
				ab = a.body,
				Y = h + "-" + ag,
				T = 0,
				an = 0,
				U = A(),
				ac = ".qtip-" + ag,
				Q = "qtip-disabled",
				ad,
				ae;
			af.id = ag;
			af.rendered = N;
			af.destroyed = N;
			af.elements = ad = { target: ao };
			af.timers = { img: {} };
			af.options = S;
			af.checks = {};
			af.plugins = {};
			af.cache = ae = {
				event: {},
				target: A(),
				disabled: N,
				attr: ah,
				onTarget: N,
				lastClass: "",
			};
			function V(ar) {
				var ap = 0,
					au,
					aq = S,
					at = ar.split(".");
				while ((aq = aq[at[ap++]])) {
					if (ap < at.length) {
						au = aq;
					}
				}
				return [au || S, at.pop()];
			}
			function ak(ap) {
				return B.concat("").join(ap ? "-" + ap + " " : " ");
			}
			function am() {
				var ap = S.style.widget,
					aq = U.hasClass(Q);
				U.removeClass(Q);
				Q = ap ? "ui-state-disabled" : "qtip-disabled";
				U.toggleClass(Q, aq);
				U.toggleClass("ui-helper-reset " + ak(), ap).toggleClass(
					G,
					S.style.def && !ap,
				);
				if (ad.content) {
					ad.content.toggleClass(ak("content"), ap);
				}
				if (ad.titlebar) {
					ad.titlebar.toggleClass(ak("header"), ap);
				}
				if (ad.button) {
					ad.button.toggleClass(h + "-icon", !ap);
				}
			}
			function P(ap) {
				if (ad.title) {
					ad.titlebar.remove();
					ad.titlebar = ad.title = ad.button = w;
					if (ap !== N) {
						af.reposition();
					}
				}
			}
			function ai() {
				var aq = S.content.title.button,
					ap = typeof aq === "string",
					ar = ap ? aq : "Close tooltip";
				if (ad.button) {
					ad.button.remove();
				}
				if (aq.jquery) {
					ad.button = aq;
				} else {
					ad.button = A("<a />", {
						class: "qtip-close " + (S.style.widget ? "" : h + "-icon"),
						title: ar,
						"aria-label": ar,
					}).prepend(
						A("<span />", { class: "ui-icon ui-icon-close", html: "&times;" }),
					);
				}
				ad.button
					.appendTo(ad.titlebar || U)
					.attr("role", "button")
					.click(function (at) {
						if (!U.hasClass(Q)) {
							af.hide(at);
						}
						return N;
					});
			}
			function X() {
				var ap = Y + "-title";
				if (ad.titlebar) {
					P();
				}
				ad.titlebar = A("<div />", {
					class: h + "-titlebar " + (S.style.widget ? ak("header") : ""),
				})
					.append(
						(ad.title = A("<div />", {
							id: ap,
							class: h + "-title",
							"aria-atomic": u,
						})),
					)
					.insertBefore(ad.content)
					.delegate(
						".qtip-close",
						"mousedown keydown mouseup keyup mouseout",
						function (aq) {
							A(this).toggleClass(
								"ui-state-active ui-state-focus",
								aq.type.substr(-4) === "down",
							);
						},
					)
					.delegate(".qtip-close", "mouseover mouseout", function (aq) {
						A(this).toggleClass("ui-state-hover", aq.type === "mouseover");
					});
				if (S.content.title.button) {
					ai();
				}
			}
			function aa(ap) {
				var aq = ad.button;
				if (!af.rendered) {
					return N;
				}
				if (!ap) {
					aq.remove();
				} else {
					ai();
				}
			}
			function al(ar, ap) {
				var aq = ad.title;
				if (!af.rendered || !ar) {
					return N;
				}
				if (A.isFunction(ar)) {
					ar = ar.call(ao, ae.event, af);
				}
				if (ar === N || (!ar && ar !== "")) {
					return P(N);
				} else {
					if (ar.jquery && ar.length > 0) {
						aq.empty().append(ar.css({ display: "block" }));
					} else {
						aq.html(ar);
					}
				}
				if (ap !== N && af.rendered && U[0].offsetWidth > 0) {
					af.reposition(ae.event);
				}
			}
			function aj(ap) {
				if (ap && A.isFunction(ap.done)) {
					ap.done(function (aq) {
						Z(aq, null, N);
					});
				}
			}
			function Z(at, aq, ap) {
				var ar = ad.content;
				if (!af.rendered || !at) {
					return N;
				}
				if (A.isFunction(at)) {
					at = at.call(ao, ae.event, af) || "";
				}
				if (ap !== N) {
					aj(S.content.deferred);
				}
				if (at.jquery && at.length > 0) {
					ar.empty().append(at.css({ display: "block" }));
				} else {
					ar.html(at);
				}
				function au(aw) {
					var av,
						ax = {};
					function ay(az) {
						if (az) {
							delete ax[az.src];
							clearTimeout(af.timers.img[az.src]);
							A(az).unbind(ac);
						}
						if (A.isEmptyObject(ax)) {
							if (aq !== N) {
								af.reposition(ae.event);
							}
							aw();
						}
					}
					if (
						(av = ar.find("img[src]:not([height]):not([width])")).length === 0
					) {
						return ay();
					}
					av.each(function (aA, aC) {
						if (ax[aC.src] !== c) {
							return;
						}
						var aB = 0,
							az = 3;
						(function aD() {
							if (aC.height || aC.width || aB > az) {
								return ay(aC);
							}
							aB += 1;
							af.timers.img[aC.src] = setTimeout(aD, 700);
						})();
						A(aC).bind("error" + ac + " load" + ac, function () {
							ay(this);
						});
						ax[aC.src] = aC;
					});
				}
				if (af.rendered < 0) {
					U.queue("fx", au);
				} else {
					an = 0;
					au(A.noop);
				}
				return af;
			}
			function R() {
				var at = S.position,
					aq = {
						show: S.show.target,
						hide: S.hide.target,
						viewport: A(at.viewport),
						document: A(a),
						body: A(a.body),
						window: A(b),
					},
					ar = {
						show: A.trim("" + S.show.event).split(" "),
						hide: A.trim("" + S.hide.event).split(" "),
					},
					ap = A.browser.msie && parseInt(A.browser.version, 10) === 6;
				function av(ay) {
					if (U.hasClass(Q)) {
						return N;
					}
					clearTimeout(af.timers.show);
					clearTimeout(af.timers.hide);
					var az = function () {
						af.toggle(u, ay);
					};
					if (S.show.delay > 0) {
						af.timers.show = setTimeout(az, S.show.delay);
					} else {
						az();
					}
				}
				function au(aB) {
					if (U.hasClass(Q) || T || an) {
						return N;
					}
					var az = A(aB.relatedTarget || aB.target),
						ay = az.closest(j)[0] === U[0],
						aA = az[0] === aq.show[0];
					clearTimeout(af.timers.show);
					clearTimeout(af.timers.hide);
					if (
						(at.target === "mouse" && ay) ||
						(S.hide.fixed &&
							/mouse(out|leave|move)/.test(aB.type) &&
							(ay || aA))
					) {
						try {
							aB.preventDefault();
							aB.stopImmediatePropagation();
						} catch (aC) {}
						return;
					}
					if (S.hide.delay > 0) {
						af.timers.hide = setTimeout(function () {
							af.hide(aB);
						}, S.hide.delay);
					} else {
						af.hide(aB);
					}
				}
				function aw(ay) {
					if (U.hasClass(Q)) {
						return N;
					}
					clearTimeout(af.timers.inactive);
					af.timers.inactive = setTimeout(function () {
						af.hide(ay);
					}, S.hide.inactive);
				}
				function ax(ay) {
					if (af.rendered && U[0].offsetWidth > 0) {
						af.reposition(ay);
					}
				}
				U.bind("mouseenter" + ac + " mouseleave" + ac, function (ay) {
					var az = ay.type === "mouseenter";
					if (az) {
						af.focus(ay);
					}
					U.toggleClass(m, az);
				});
				if (/mouse(out|leave)/i.test(S.hide.event)) {
					if (S.hide.leave === "window") {
						aq.window.bind("mouseout" + ac + " blur" + ac, function (ay) {
							if (
								!/select|option/.test(ay.target.nodeName) &&
								!ay.relatedTarget
							) {
								af.hide(ay);
							}
						});
					}
				}
				if (S.hide.fixed) {
					aq.hide = aq.hide.add(U);
					U.bind("mouseover" + ac, function () {
						if (!U.hasClass(Q)) {
							clearTimeout(af.timers.hide);
						}
					});
				} else {
					if (/mouse(over|enter)/i.test(S.show.event)) {
						aq.hide.bind("mouseleave" + ac, function (ay) {
							clearTimeout(af.timers.show);
						});
					}
				}
				if (("" + S.hide.event).indexOf("unfocus") > -1) {
					at.container
						.closest("html")
						.bind("mousedown" + ac + " touchstart" + ac, function (aB) {
							var aA = A(aB.target),
								az = af.rendered && !U.hasClass(Q) && U[0].offsetWidth > 0,
								ay = aA.parents(j).filter(U[0]).length > 0;
							if (
								aA[0] !== ao[0] &&
								aA[0] !== U[0] &&
								!ay &&
								!ao.has(aA[0]).length &&
								!aA.attr("disabled")
							) {
								af.hide(aB);
							}
						});
				}
				if ("number" === typeof S.hide.inactive) {
					aq.show.bind("qtip-" + ag + "-inactive", aw);
					A.each(J.inactiveEvents, function (ay, az) {
						aq.hide.add(ad.tooltip).bind(az + ac + "-inactive", aw);
					});
				}
				A.each(ar.hide, function (az, aA) {
					var ay = A.inArray(aA, ar.show),
						aB = A(aq.hide);
					if (
						(ay > -1 && aB.add(aq.show).length === aB.length) ||
						aA === "unfocus"
					) {
						aq.show.bind(aA + ac, function (aC) {
							if (U[0].offsetWidth > 0) {
								au(aC);
							} else {
								av(aC);
							}
						});
						delete ar.show[ay];
					} else {
						aq.hide.bind(aA + ac, au);
					}
				});
				A.each(ar.show, function (ay, az) {
					aq.show.bind(az + ac, av);
				});
				if ("number" === typeof S.hide.distance) {
					aq.show.add(U).bind("mousemove" + ac, function (aB) {
						var aA = ae.origin || {},
							az = S.hide.distance,
							ay = Math.abs;
						if (
							ay(aB.pageX - aA.pageX) >= az ||
							ay(aB.pageY - aA.pageY) >= az
						) {
							af.hide(aB);
						}
					});
				}
				if (at.target === "mouse") {
					aq.show.bind("mousemove" + ac, F);
					if (at.adjust.mouse) {
						if (S.hide.event) {
							U.bind("mouseleave" + ac, function (ay) {
								if ((ay.relatedTarget || ay.target) !== aq.show[0]) {
									af.hide(ay);
								}
							});
							ad.target.bind(
								"mouseenter" + ac + " mouseleave" + ac,
								function (ay) {
									ae.onTarget = ay.type === "mouseenter";
								},
							);
						}
						aq.document.bind("mousemove" + ac, function (ay) {
							if (
								af.rendered &&
								ae.onTarget &&
								!U.hasClass(Q) &&
								U[0].offsetWidth > 0
							) {
								af.reposition(ay || E);
							}
						});
					}
				}
				if (at.adjust.resize || aq.viewport.length) {
					(A.event.special.resize ? aq.viewport : aq.window).bind(
						"resize" + ac,
						ax,
					);
				}
				aq.window.bind("scroll" + ac, ax);
			}
			function W() {
				var ap = [
					S.show.target[0],
					S.hide.target[0],
					af.rendered && ad.tooltip[0],
					S.position.container[0],
					S.position.viewport[0],
					S.position.container.closest("html")[0],
					b,
					a,
				];
				if (af.rendered) {
					A([])
						.pushStack(
							A.grep(ap, function (aq) {
								return typeof aq === "object";
							}),
						)
						.unbind(ac);
				} else {
					S.show.target.unbind(ac + "-create");
				}
			}
			af.checks.builtin = {
				"^id$": function (ar, at, ap) {
					var au = ap === u ? J.nextid : ap,
						aq = h + "-" + au;
					if (au !== N && au.length > 0 && !A("#" + aq).length) {
						U[0].id = aq;
						ad.content[0].id = aq + "-content";
						ad.title[0].id = aq + "-title";
					}
				},
				"^content.text$": function (aq, ar, ap) {
					Z(S.content.text);
				},
				"^content.deferred$": function (aq, ar, ap) {
					aj(S.content.deferred);
				},
				"^content.title.text$": function (aq, ar, ap) {
					if (!ap) {
						return P();
					}
					if (!ad.title && ap) {
						X();
					}
					al(ap);
				},
				"^content.title.button$": function (aq, ar, ap) {
					aa(ap);
				},
				"^position.(my|at)$": function (aq, ar, ap) {
					if ("string" === typeof ap) {
						aq[ar] = new v.Corner(ap);
					}
				},
				"^position.container$": function (aq, ar, ap) {
					if (af.rendered) {
						U.appendTo(ap);
					}
				},
				"^show.ready$": function () {
					if (!af.rendered) {
						af.render(1);
					} else {
						af.toggle(u);
					}
				},
				"^style.classes$": function (aq, ar, ap) {
					U.attr("class", h + " qtip " + ap);
				},
				"^style.width|height": function (aq, ar, ap) {
					U.css(ar, ap);
				},
				"^style.widget|content.title": am,
				"^events.(render|show|move|hide|focus|blur)$": function (aq, ar, ap) {
					U[(A.isFunction(ap) ? "" : "un") + "bind"]("tooltip" + ar, ap);
				},
				"^(show|hide|position).(event|target|fixed|inactive|leave|distance|viewport|adjust)":
					function () {
						var ap = S.position;
						U.attr("tracking", ap.target === "mouse" && ap.adjust.mouse);
						W();
						R();
					},
			};
			A.extend(af, {
				_triggerEvent: function (aq, ap, ar) {
					var at = A.Event("tooltip" + aq);
					at.originalEvent = (ar ? A.extend({}, ar) : w) || ae.event || w;
					U.trigger(at, [af].concat(ap || []));
					return !at.isDefaultPrevented();
				},
				render: function (ap) {
					if (af.rendered) {
						return af;
					}
					var at = S.content.text,
						ar = S.content.title,
						aq = S.position;
					A.attr(ao[0], "aria-describedby", Y);
					U = ad.tooltip = A("<div/>", {
						id: Y,
						class: [
							h,
							G,
							S.style.classes,
							h + "-pos-" + S.position.my.abbrev(),
						].join(" "),
						width: S.style.width || "",
						height: S.style.height || "",
						tracking: aq.target === "mouse" && aq.adjust.mouse,
						role: "alert",
						"aria-live": "polite",
						"aria-atomic": N,
						"aria-describedby": Y + "-content",
						"aria-hidden": u,
					})
						.toggleClass(Q, ae.disabled)
						.data("qtip", af)
						.appendTo(S.position.container)
						.append(
							(ad.content = A("<div />", {
								class: h + "-content",
								id: Y + "-content",
								"aria-atomic": u,
							})),
						);
					af.rendered = -1;
					T = 1;
					if (ar.text) {
						X();
						if (!A.isFunction(ar.text)) {
							al(ar.text, N);
						}
					} else {
						if (ar.button) {
							ai();
						}
					}
					if (!A.isFunction(at) || at.then) {
						Z(at, N);
					}
					af.rendered = u;
					am();
					A.each(S.events, function (au, av) {
						if (A.isFunction(av)) {
							U.bind(
								au === "toggle" ? "tooltipshow tooltiphide" : "tooltip" + au,
								av,
							);
						}
					});
					A.each(v, function () {
						if (this.initialize === "render") {
							this(af);
						}
					});
					R();
					U.queue("fx", function (au) {
						af._triggerEvent("render");
						T = 0;
						if (S.show.ready || ap) {
							af.toggle(u, ae.event, N);
						}
						au();
					});
					return af;
				},
				get: function (aq) {
					var ap, ar;
					switch (aq.toLowerCase()) {
						case "dimensions":
							ap = { height: U.outerHeight(N), width: U.outerWidth(N) };
							break;
						case "offset":
							ap = v.offset(U, S.position.container);
							break;
						default:
							ar = V(aq.toLowerCase());
							ap = ar[0][ar[1]];
							ap = ap.precedance ? ap.string() : ap;
							break;
					}
					return ap;
				},
				set: function (av, aw) {
					var au =
							/^position\.(my|at|adjust|target|container)|style|content|show\.ready/i,
						aq = /^content\.(title|attr)|style/i,
						ap = N,
						at = af.checks,
						ar;
					function ax(aB, az) {
						var aA, aC, ay;
						for (aA in at) {
							for (aC in at[aA]) {
								if ((ay = new RegExp(aC, "i").exec(aB))) {
									az.push(ay);
									at[aA][aC].apply(af, az);
								}
							}
						}
					}
					if ("string" === typeof av) {
						ar = av;
						av = {};
						av[ar] = aw;
					} else {
						av = A.extend(u, {}, av);
					}
					A.each(av, function (az, aA) {
						var aB = V(az.toLowerCase()),
							ay;
						ay = aB[0][aB[1]];
						aB[0][aB[1]] = "object" === typeof aA && aA.nodeType ? A(aA) : aA;
						av[az] = [aB[0], aB[1], aA, ay];
						ap = au.test(az) || ap;
					});
					t(S);
					T = 1;
					A.each(av, ax);
					T = 0;
					if (af.rendered && U[0].offsetWidth > 0 && ap) {
						af.reposition(S.position.target === "mouse" ? w : ae.event);
					}
					return af;
				},
				toggle: function (ar, at) {
					if (at) {
						if (
							/over|enter/.test(at.type) &&
							/out|leave/.test(ae.event.type) &&
							S.show.target.add(at.target).length === S.show.target.length &&
							U.has(at.relatedTarget).length
						) {
							return af;
						}
						ae.event = A.extend({}, at);
					}
					if (!af.rendered) {
						return ar ? af.render(1) : af;
					}
					var aA = ar ? "show" : "hide",
						ap = S[aA],
						av = S[!ar ? "show" : "hide"],
						aC = S.position,
						ay = S.content,
						aw = U[0].offsetWidth > 0,
						au = ar || ap.target.length === 1,
						ax = !at || ap.target.length < 2 || ae.target[0] === at.target,
						aB,
						az;
					if ((typeof ar).search("boolean|number")) {
						ar = !aw;
					}
					if (!U.is(":animated") && aw === ar && ax) {
						return af;
					}
					if (!af._triggerEvent(aA, [90])) {
						return af;
					}
					A.attr(U[0], "aria-hidden", !!!ar);
					if (ar) {
						ae.origin = A.extend({}, E);
						af.focus(at);
						if (A.isFunction(ay.text)) {
							Z(ay.text, N);
						}
						if (A.isFunction(ay.title.text)) {
							al(ay.title.text, N);
						}
						if (!L && aC.target === "mouse" && aC.adjust.mouse) {
							A(a).bind("mousemove.qtip", F);
							L = u;
						}
						af.reposition(at, arguments[2]);
						if (!!ap.solo) {
							A(j, ap.solo).not(U).qtip("hide", A.Event("tooltipsolo"));
						}
					} else {
						clearTimeout(af.timers.show);
						delete ae.origin;
						if (
							L &&
							!A(j + '[tracking="true"]:visible', ap.solo).not(U).length
						) {
							A(a).unbind("mousemove.qtip");
							L = N;
						}
						af.blur(at);
					}
					function aq() {
						if (ar) {
							if (A.browser.msie) {
								U[0].style.removeAttribute("filter");
							}
							U.css("overflow", "");
							if ("string" === typeof ap.autofocus) {
								A(ap.autofocus, U).focus();
							}
							ap.target.trigger("qtip-" + ag + "-inactive");
						} else {
							U.css({
								display: "",
								visibility: "",
								opacity: "",
								left: "",
								top: "",
							});
						}
						af._triggerEvent(ar ? "visible" : "hidden");
					}
					if (ap.effect === N || au === N) {
						U[aA]();
						aq.call(U);
					} else {
						if (A.isFunction(ap.effect)) {
							U.stop(1, 1);
							ap.effect.call(U, af);
							U.queue("fx", function (aD) {
								aq();
								aD();
							});
						} else {
							U.fadeTo(90, ar ? 1 : 0, aq);
						}
					}
					if (ar) {
						ap.target.trigger("qtip-" + ag + "-inactive");
					}
					return af;
				},
				show: function (ap) {
					return af.toggle(u, ap);
				},
				hide: function (ap) {
					return af.toggle(N, ap);
				},
				focus: function (au) {
					if (!af.rendered) {
						return af;
					}
					var av = A(j),
						ar = parseInt(U[0].style.zIndex, 10),
						aq = J.zindex + av.length,
						at = A.extend({}, au),
						ap;
					if (!U.hasClass(M)) {
						if (af._triggerEvent("focus", [aq], at)) {
							if (ar !== aq) {
								av.each(function () {
									if (this.style.zIndex > ar) {
										this.style.zIndex = this.style.zIndex - 1;
									}
								});
								av.filter("." + M).qtip("blur", at);
							}
							U.addClass(M)[0].style.zIndex = aq;
						}
					}
					return af;
				},
				blur: function (ap) {
					U.removeClass(M);
					af._triggerEvent("blur", [U.css("zIndex")], ap);
					return af;
				},
				reposition: function (aG, aD) {
					if (!af.rendered || T) {
						return af;
					}
					T = 1;
					var aK = S.position.target,
						aJ = S.position,
						aB = aJ.my,
						aC = aJ.at,
						aE = aJ.adjust,
						aq = aE.method.split(" "),
						aH = U.outerWidth(N),
						aF = U.outerHeight(N),
						ax = 0,
						ay = 0,
						ar = U.css("position"),
						aI = aJ.viewport,
						aL = { left: 0, top: 0 },
						az = aJ.container,
						ap = U[0].offsetWidth > 0,
						aA = aG && aG.type === "scroll",
						av = A(b),
						au,
						aw;
					if (A.isArray(aK) && aK.length === 2) {
						aC = { x: r, y: C };
						aL = { left: aK[0], top: aK[1] };
					} else {
						if (aK === "mouse" && ((aG && aG.pageX) || ae.event.pageX)) {
							aC = { x: r, y: C };
							aG =
								E && E.pageX && (aE.mouse || !aG || !aG.pageX)
									? { pageX: E.pageX, pageY: E.pageY }
									: (aG && (aG.type === "resize" || aG.type === "scroll")
											? ae.event
											: aG && aG.pageX && aG.type === "mousemove"
											? aG
											: !aE.mouse &&
											  ae.origin &&
											  ae.origin.pageX &&
											  S.show.distance
											? ae.origin
											: aG) ||
									  aG ||
									  ae.event ||
									  E ||
									  {};
							if (ar !== "static") {
								aL = az.offset();
							}
							aL = { left: aG.pageX - aL.left, top: aG.pageY - aL.top };
							if (aE.mouse && aA) {
								aL.left -= E.scrollX - av.scrollLeft();
								aL.top -= E.scrollY - av.scrollTop();
							}
						} else {
							if (
								aK === "event" &&
								aG &&
								aG.target &&
								aG.type !== "scroll" &&
								aG.type !== "resize"
							) {
								ae.target = A(aG.target);
							} else {
								if (aK !== "event") {
									ae.target = A(aK.jquery ? aK : ad.target);
								}
							}
							aK = ae.target;
							aK = A(aK).eq(0);
							if (aK.length === 0) {
								return af;
							} else {
								if (aK[0] === a || aK[0] === b) {
									ax = v.iOS ? b.innerWidth : aK.width();
									ay = v.iOS ? b.innerHeight : aK.height();
									if (aK[0] === b) {
										aL = {
											top: (aI || aK).scrollTop(),
											left: (aI || aK).scrollLeft(),
										};
									}
								} else {
									if (v.imagemap && aK.is("area")) {
										au = v.imagemap(af, aK, aC, v.viewport ? aq : N);
									} else {
										if (v.svg && aK[0].ownerSVGElement) {
											au = v.svg(af, aK, aC, v.viewport ? aq : N);
										} else {
											ax = aK.outerWidth(N);
											ay = aK.outerHeight(N);
											aL = v.offset(aK, az);
										}
									}
								}
							}
							if (au) {
								ax = au.width;
								ay = au.height;
								aw = au.offset;
								aL = au.position;
							}
							if (
								(v.iOS > 3.1 && v.iOS < 4.1) ||
								(v.iOS >= 4.3 && v.iOS < 4.33) ||
								(!v.iOS && ar === "fixed")
							) {
								aL.left -= av.scrollLeft();
								aL.top -= av.scrollTop();
							}
							aL.left += aC.x === O ? ax : aC.x === x ? ax / 2 : 0;
							aL.top += aC.y === y ? ay : aC.y === x ? ay / 2 : 0;
						}
					}
					aL.left += aE.x + (aB.x === O ? -aH : aB.x === x ? -aH / 2 : 0);
					aL.top += aE.y + (aB.y === y ? -aF : aB.y === x ? -aF / 2 : 0);
					if (v.viewport) {
						aL.adjusted = v.viewport(af, aL, aJ, ax, ay, aH, aF);
						if (aw && aL.adjusted.left) {
							aL.left += aw.left;
						}
						if (aw && aL.adjusted.top) {
							aL.top += aw.top;
						}
					} else {
						aL.adjusted = { left: 0, top: 0 };
					}
					if (!af._triggerEvent("move", [aL, aI.elem || aI], aG)) {
						return af;
					}
					delete aL.adjusted;
					if (
						aD === N ||
						!ap ||
						isNaN(aL.left) ||
						isNaN(aL.top) ||
						aK === "mouse" ||
						!A.isFunction(aJ.effect)
					) {
						U.css(aL);
					} else {
						if (A.isFunction(aJ.effect)) {
							aJ.effect.call(U, af, A.extend({}, aL));
							U.queue(function (at) {
								A(this).css({ opacity: "", height: "" });
								if (A.browser.msie) {
									this.style.removeAttribute("filter");
								}
								at();
							});
						}
					}
					T = 0;
					return af;
				},
				disable: function (ap) {
					if ("boolean" !== typeof ap) {
						ap = !(U.hasClass(Q) || ae.disabled);
					}
					if (af.rendered) {
						U.toggleClass(Q, ap);
						A.attr(U[0], "aria-disabled", ap);
					} else {
						ae.disabled = !!ap;
					}
					return af;
				},
				enable: function () {
					return af.disable(N);
				},
				destroy: function () {
					var ap = ao[0],
						aq = A.attr(ap, l),
						ar = ao.data("qtip");
					af.destroyed = u;
					if (af.rendered) {
						U.stop(1, 0).remove();
						A.each(af.plugins, function () {
							if (this.destroy) {
								this.destroy();
							}
						});
					}
					clearTimeout(af.timers.show);
					clearTimeout(af.timers.hide);
					W();
					if (!ar || af === ar) {
						A.removeData(ap, "qtip");
						if (S.suppress && aq) {
							A.attr(ap, "title", aq);
							ao.removeAttr(l);
						}
						ao.removeAttr("aria-describedby");
					}
					ao.unbind(".qtip-" + ag);
					delete k[af.id];
					return ao;
				},
			});
		}
		function K(Q, P) {
			var T,
				ac,
				X,
				R,
				aa,
				S = A(this),
				U = A(a.body),
				Z = this === a ? U : S,
				Y = S.metadata ? S.metadata(P.metadata) : w,
				ab = P.metadata.type === "html5" && Y ? Y[P.metadata.name] : w,
				V = S.data(P.metadata.name || "qtipopts");
			try {
				V = typeof V === "string" ? A.parseJSON(V) : V;
			} catch (W) {}
			R = A.extend(
				u,
				{},
				J.defaults,
				P,
				typeof V === "object" ? t(V) : w,
				t(ab || Y),
			);
			ac = R.position;
			R.id = Q;
			if ("boolean" === typeof R.content.text) {
				X = S.attr(R.content.attr);
				if (R.content.attr !== N && X) {
					R.content.text = X;
				} else {
					return N;
				}
			}
			if (!ac.container.length) {
				ac.container = U;
			}
			if (ac.target === N) {
				ac.target = Z;
			}
			if (R.show.target === N) {
				R.show.target = Z;
			}
			if (R.show.solo === u) {
				R.show.solo = ac.container.closest("body");
			}
			if (R.hide.target === N) {
				R.hide.target = Z;
			}
			if (R.position.viewport === u) {
				R.position.viewport = ac.container;
			}
			ac.container = ac.container.eq(0);
			ac.at = new v.Corner(ac.at);
			ac.my = new v.Corner(ac.my);
			if (A.data(this, "qtip")) {
				if (R.overwrite) {
					S.qtip("destroy");
				} else {
					if (R.overwrite === N) {
						return N;
					}
				}
			}
			if (R.suppress && (aa = A.attr(this, "title"))) {
				A(this).removeAttr("title").attr(l, aa).attr("title", "");
			}
			T = new f(S, R, Q, !!X);
			A.data(this, "qtip", T);
			S.bind("remove.qtip-" + Q + " removeqtip.qtip-" + Q, function () {
				T.destroy();
			});
			return T;
		}
		J = A.fn.qtip = function (Q, U, V) {
			var W = ("" + Q).toLowerCase(),
				T = w,
				P = A.makeArray(arguments).slice(1),
				S = P[P.length - 1],
				R = this[0] ? A.data(this[0], "qtip") : w;
			if ((!arguments.length && R) || W === "api") {
				return R;
			} else {
				if ("string" === typeof Q) {
					this.each(function () {
						var X = A.data(this, "qtip");
						if (!X) {
							return u;
						}
						if (S && S.timeStamp) {
							X.cache.event = S;
						}
						if ((W === "option" || W === "options") && U) {
							if (A.isPlainObject(U) || V !== c) {
								X.set(U, V);
							} else {
								T = X.get(U);
								return N;
							}
						} else {
							if (X[W]) {
								X[W].apply(X[W], P);
							}
						}
					});
					return T !== w ? T : this;
				} else {
					if ("object" === typeof Q || !arguments.length) {
						R = t(A.extend(u, {}, Q));
						return J.bind.call(this, R, S);
					}
				}
			}
		};
		J.bind = function (Q, P) {
			return this.each(function (U) {
				var S, R, T, W, V, Y;
				Y = A.isArray(Q.id) ? Q.id[U] : Q.id;
				Y = !Y || Y === N || Y.length < 1 || k[Y] ? J.nextid++ : (k[Y] = Y);
				W = ".qtip-" + Y + "-create";
				V = K.call(this, Y, Q);
				if (V === N) {
					return u;
				}
				S = V.options;
				A.each(v, function () {
					if (this.initialize === "initialize") {
						this(V);
					}
				});
				R = { show: S.show.target, hide: S.hide.target };
				T = {
					show: A.trim("" + S.show.event).replace(/ /g, W + " ") + W,
					hide: A.trim("" + S.hide.event).replace(/ /g, W + " ") + W,
				};
				if (
					/mouse(over|enter)/i.test(T.show) &&
					!/mouse(out|leave)/i.test(T.hide)
				) {
					T.hide += " mouseleave" + W;
				}
				R.show.bind("mousemove" + W, function (Z) {
					F(Z);
					V.cache.onTarget = u;
				});
				function X(aa) {
					function Z() {
						V.render(typeof aa === "object" || S.show.ready);
						R.show.add(R.hide).unbind(W);
					}
					if (V.cache.disabled) {
						return N;
					}
					V.cache.event = A.extend({}, aa);
					V.cache.target = aa ? A(aa.target) : [c];
					if (S.show.delay > 0) {
						clearTimeout(V.timers.show);
						V.timers.show = setTimeout(Z, S.show.delay);
						if (T.show !== T.hide) {
							R.hide.bind(T.hide, function () {
								clearTimeout(V.timers.show);
							});
						}
					} else {
						Z();
					}
				}
				R.show.bind(T.show, X);
				if (S.show.ready || S.prerender) {
					X(P);
				}
			}).attr("data-hasqtip", u);
		};
		v = J.plugins = {
			Corner: function (P) {
				P = ("" + P)
					.replace(/([A-Z])/, " $1")
					.replace(/middle/gi, x)
					.toLowerCase();
				this.x = (P.match(/left|right/i) ||
					P.match(/center/) || ["inherit"])[0].toLowerCase();
				this.y = (P.match(/top|bottom|center/i) || [
					"inherit",
				])[0].toLowerCase();
				var Q = P.charAt(0);
				this.precedance = Q === "t" || Q === "b" ? d : e;
				this.string = function () {
					return this.precedance === d ? this.y + this.x : this.x + this.y;
				};
				this.abbrev = function () {
					var R = this.x.substr(0, 1),
						S = this.y.substr(0, 1);
					return R === S ? R : this.precedance === d ? S + R : R + S;
				};
				this.invertx = function (R) {
					this.x = this.x === r ? O : this.x === O ? r : R || this.x;
				};
				this.inverty = function (R) {
					this.y = this.y === C ? y : this.y === y ? C : R || this.y;
				};
				this.clone = function () {
					return {
						x: this.x,
						y: this.y,
						precedance: this.precedance,
						string: this.string,
						abbrev: this.abbrev,
						clone: this.clone,
						invertx: this.invertx,
						inverty: this.inverty,
					};
				};
			},
			offset: function (S, P) {
				var W = S.offset(),
					U = S.closest("body"),
					V = A.browser.msie && a.compatMode !== "CSS1Compat",
					Y = P,
					Q,
					R,
					T;
				function X(aa, Z) {
					W.left += Z * aa.scrollLeft();
					W.top += Z * aa.scrollTop();
				}
				if (Y) {
					do {
						if (Y.css("position") !== "static") {
							R = Y.position();
							W.left -=
								R.left +
								(parseInt(Y.css("borderLeftWidth"), 10) || 0) +
								(parseInt(Y.css("marginLeft"), 10) || 0);
							W.top -=
								R.top +
								(parseInt(Y.css("borderTopWidth"), 10) || 0) +
								(parseInt(Y.css("marginTop"), 10) || 0);
							if (
								!Q &&
								(T = Y.css("overflow")) !== "hidden" &&
								T !== "visible"
							) {
								Q = Y;
							}
						}
					} while ((Y = A(Y[0].offsetParent)).length);
					if ((Q && Q[0] !== U[0]) || V) {
						X(Q || U, 1);
					}
				}
				return W;
			},
			iOS:
				parseFloat(
					(
						"" +
						(/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(
							navigator.userAgent,
						) || [0, ""])[1]
					)
						.replace("undefined", "3_2")
						.replace("_", ".")
						.replace("_", ""),
				) || N,
			fn: {
				attr: function (P, T) {
					if (this.length) {
						var Q = this[0],
							S = "title",
							R = A.data(Q, "qtip");
						if (P === S && R && "object" === typeof R && R.options.suppress) {
							if (arguments.length < 2) {
								return A.attr(Q, l);
							}
							if (R && R.options.content.attr === S && R.cache.attr) {
								R.set("content.text", T);
							}
							return this.attr(l, T);
						}
					}
					return A.fn["attr" + o].apply(this, arguments);
				},
				clone: function (Q) {
					var S = A([]),
						R = "title",
						P = A.fn["clone" + o].apply(this, arguments);
					if (!Q) {
						P.filter("[" + l + "]")
							.attr("title", function () {
								return A.attr(this, l);
							})
							.removeAttr(l);
					}
					return P;
				},
			},
		};
		A.each(v.fn, function (Q, R) {
			if (!R || A.fn[Q + o]) {
				return u;
			}
			var P = (A.fn[Q + o] = A.fn[Q]);
			A.fn[Q] = function () {
				return R.apply(this, arguments) || P.apply(this, arguments);
			};
		});
		if (!A.ui) {
			A["cleanData" + o] = A.cleanData;
			A.cleanData = function (P) {
				for (var Q = 0, R; (R = P[Q]) !== c; Q++) {
					try {
						A(R).triggerHandler("removeqtip");
					} catch (S) {}
				}
				A["cleanData" + o](P);
			};
		}
		J.version = "2.0.1";
		J.nextid = 0;
		J.inactiveEvents =
			"click dblclick mousedown mouseup mousemove mouseleave mouseenter".split(
				" ",
			);
		J.zindex = 15000;
		J.defaults = {
			prerender: N,
			id: N,
			overwrite: u,
			suppress: u,
			content: {
				text: u,
				attr: "title",
				deferred: N,
				title: { text: N, button: N },
			},
			position: {
				my: "top left",
				at: "bottom right",
				target: N,
				container: N,
				viewport: N,
				adjust: {
					x: 0,
					y: 0,
					mouse: u,
					resize: u,
					method: "flipinvert flipinvert",
				},
				effect: function (Q, R, P) {
					A(this).animate(R, { duration: 200, queue: N });
				},
			},
			show: {
				target: N,
				event: "mouseenter",
				effect: u,
				delay: 90,
				solo: N,
				ready: N,
				autofocus: N,
			},
			hide: {
				target: N,
				event: "mouseleave",
				effect: u,
				delay: 0,
				fixed: N,
				inactive: N,
				leave: "window",
				distance: N,
			},
			style: { classes: "", widget: N, width: N, height: N, def: u },
			events: {
				render: w,
				move: w,
				show: w,
				hide: w,
				toggle: w,
				visible: w,
				hidden: w,
				focus: w,
				blur: w,
			},
		};
		v.svg = function (V, U, Z, S) {
			var Y = A(a),
				R = U[0],
				aa = {
					width: 0,
					height: 0,
					position: { top: 10000000000, left: 10000000000 },
				},
				T,
				P,
				W,
				X,
				Q;
			while (!R.getBBox) {
				R = R.parentNode;
			}
			if (R.getBBox && R.parentNode) {
				T = R.getBBox();
				P = R.getScreenCTM();
				W = R.farthestViewportElement || R;
				if (!W.createSVGPoint) {
					return aa;
				}
				X = W.createSVGPoint();
				X.x = T.x;
				X.y = T.y;
				Q = X.matrixTransform(P);
				aa.position.left = Q.x;
				aa.position.top = Q.y;
				X.x += T.width;
				X.y += T.height;
				Q = X.matrixTransform(P);
				aa.width = Q.x - aa.position.left;
				aa.height = Q.y - aa.position.top;
				aa.position.left += Y.scrollLeft();
				aa.position.top += Y.scrollTop();
			}
			return aa;
		};
		function s(T) {
			var X = this,
				Y = T.elements.tooltip,
				P = T.options.content.ajax,
				R = J.defaults.content.ajax,
				Q = ".qtip-ajax",
				U = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
				S = u,
				V = N,
				W;
			T.checks.ajax = {
				"^content.ajax": function (ab, aa, Z) {
					if (aa === "ajax") {
						P = Z;
					}
					if (aa === "once") {
						X.init();
					} else {
						if (P && P.url) {
							X.load();
						} else {
							Y.unbind(Q);
						}
					}
				},
			};
			A.extend(X, {
				init: function () {
					if (P && P.url) {
						Y.unbind(Q)[P.once ? "one" : "bind"]("tooltipshow" + Q, X.load);
					}
					return X;
				},
				load: function (aa) {
					if (V) {
						V = N;
						return;
					}
					var ad = P.url.lastIndexOf(" "),
						ab = P.url,
						ac,
						ah = !P.loading && S;
					if (ah) {
						try {
							aa.preventDefault();
						} catch (af) {}
					} else {
						if (aa && aa.isDefaultPrevented()) {
							return X;
						}
					}
					if (W && W.abort) {
						W.abort();
					}
					if (ad > -1) {
						ac = ab.substr(ad);
						ab = ab.substr(0, ad);
					}
					function Z() {
						var ai;
						if (T.destroyed) {
							return;
						}
						S = N;
						if (ah) {
							V = u;
							T.show(aa.originalEvent);
						}
						if ((ai = R.complete || P.complete) && A.isFunction(ai)) {
							ai.apply(P.context || T, arguments);
						}
					}
					function ag(ak, ai, aj) {
						var al;
						if (T.destroyed) {
							return;
						}
						if (ac && "string" === typeof ak) {
							ak = A("<div/>").append(ak.replace(U, "")).find(ac);
						}
						if ((al = R.success || P.success) && A.isFunction(al)) {
							al.call(P.context || T, ak, ai, aj);
						} else {
							T.set("content.text", ak);
						}
					}
					function ae(ak, ai, aj) {
						if (T.destroyed || ak.status === 0) {
							return;
						}
						T.set("content.text", ai + ": " + aj);
					}
					W = A.ajax(
						A.extend({ error: R.error || ae, context: T }, P, {
							url: ab,
							success: ag,
							complete: Z,
						}),
					);
				},
				destroy: function () {
					if (W && W.abort) {
						W.abort();
					}
					T.destroyed = u;
				},
			});
			X.init();
		}
		v.ajax = function (Q) {
			var P = Q.plugins.ajax;
			return "object" === typeof P ? P : (Q.plugins.ajax = new s(Q));
		};
		v.ajax.initialize = "render";
		v.ajax.sanitize = function (P) {
			var R = P.content,
				Q;
			if (R && "ajax" in R) {
				Q = R.ajax;
				if (typeof Q !== "object") {
					Q = P.content.ajax = { url: Q };
				}
				if ("boolean" !== typeof Q.once && Q.once) {
					Q.once = !!Q.once;
				}
			}
		};
		A.extend(u, J.defaults, { content: { ajax: { loading: u, once: u } } });
		function p(U, S, Q) {
			var R = Math.ceil(S / 2),
				T = Math.ceil(Q / 2),
				P = {
					bottomright: [
						[0, 0],
						[S, Q],
						[S, 0],
					],
					bottomleft: [
						[0, 0],
						[S, 0],
						[0, Q],
					],
					topright: [
						[0, Q],
						[S, 0],
						[S, Q],
					],
					topleft: [
						[0, 0],
						[0, Q],
						[S, Q],
					],
					topcenter: [
						[0, Q],
						[R, 0],
						[S, Q],
					],
					bottomcenter: [
						[0, 0],
						[S, 0],
						[R, Q],
					],
					rightcenter: [
						[0, 0],
						[S, T],
						[0, Q],
					],
					leftcenter: [
						[S, 0],
						[S, Q],
						[0, T],
					],
				};
			P.lefttop = P.bottomright;
			P.righttop = P.bottomleft;
			P.leftbottom = P.topright;
			P.rightbottom = P.topleft;
			return P[U.string()];
		}
		function I(aa, Q) {
			var Y = this,
				U = aa.options.style.tip,
				ak = aa.elements,
				R = ak.tooltip,
				W = { top: 0, left: 0 },
				X = { width: U.width, height: U.height },
				af = {},
				ad = U.border || 0,
				T = ".qtip-tip",
				ab = !!(A("<canvas />")[0] || {}).getContext,
				aj;
			Y.corner = w;
			Y.mimic = w;
			Y.border = ad;
			Y.offset = U.offset;
			Y.size = X;
			aa.checks.tip = {
				"^position.my|style.tip.(corner|mimic|border)$": function () {
					if (!Y.init()) {
						Y.destroy();
					}
					aa.reposition();
				},
				"^style.tip.(height|width)$": function () {
					X = { width: U.width, height: U.height };
					Y.create();
					Y.update();
					aa.reposition();
				},
				"^content.title.text|style.(classes|widget)$": function () {
					if (ak.tip && ak.tip.length) {
						Y.update();
					}
				},
			};
			function al(an) {
				var am = R.is(":visible");
				R.show();
				an();
				R.toggle(am);
			}
			function S() {
				X.width = U.height;
				X.height = U.width;
			}
			function P() {
				X.width = U.width;
				X.height = U.height;
			}
			function ae(an, au, ax, av) {
				if (!ak.tip) {
					return;
				}
				var az = Y.corner.clone(),
					ay = ax.adjusted,
					am = aa.options.position.adjust.method.split(" "),
					ao = am[0],
					aq = am[1] || am[0],
					ap = { left: N, top: N, x: 0, y: 0 },
					ar,
					at = {},
					aw;
				if (Y.corner.fixed !== u) {
					if (ao === D && az.precedance === e && ay.left && az.y !== x) {
						az.precedance = az.precedance === e ? d : e;
					} else {
						if (ao !== D && ay.left) {
							az.x = az.x === x ? (ay.left > 0 ? r : O) : az.x === r ? O : r;
						}
					}
					if (aq === D && az.precedance === d && ay.top && az.x !== x) {
						az.precedance = az.precedance === d ? e : d;
					} else {
						if (aq !== D && ay.top) {
							az.y = az.y === x ? (ay.top > 0 ? C : y) : az.y === C ? y : C;
						}
					}
					if (
						az.string() !== W.corner.string() &&
						(W.top !== ay.top || W.left !== ay.left)
					) {
						Y.update(az, N);
					}
				}
				ar = Y.position(az, ay);
				ar[az.x] += ag(az, az.x);
				ar[az.y] += ag(az, az.y);
				if (ar.right !== c) {
					ar.left = -ar.right;
				}
				if (ar.bottom !== c) {
					ar.top = -ar.bottom;
				}
				ar.user = Math.max(0, U.offset);
				if ((ap.left = ao === D && !!ay.left)) {
					if (az.x === x) {
						at["margin-left"] = ap.x = ar["margin-left"];
					} else {
						aw = ar.right !== c ? [ay.left, -ar.left] : [-ay.left, ar.left];
						if ((ap.x = Math.max(aw[0], aw[1])) > aw[0]) {
							ax.left -= ay.left;
							ap.left = N;
						}
						at[ar.right !== c ? O : r] = ap.x;
					}
				}
				if ((ap.top = aq === D && !!ay.top)) {
					if (az.y === x) {
						at["margin-top"] = ap.y = ar["margin-top"];
					} else {
						aw = ar.bottom !== c ? [ay.top, -ar.top] : [-ay.top, ar.top];
						if ((ap.y = Math.max(aw[0], aw[1])) > aw[0]) {
							ax.top -= ay.top;
							ap.top = N;
						}
						at[ar.bottom !== c ? y : C] = ap.y;
					}
				}
				ak.tip
					.css(at)
					.toggle(
						!((ap.x && ap.y) || (az.x === x && ap.y) || (az.y === x && ap.x)),
					);
				ax.left -= ar.left.charAt
					? ar.user
					: ao !== D || ap.top || (!ap.left && !ap.top)
					? ar.left
					: 0;
				ax.top -= ar.top.charAt
					? ar.user
					: aq !== D || ap.left || (!ap.left && !ap.top)
					? ar.top
					: 0;
				W.left = ay.left;
				W.top = ay.top;
				W.corner = az.clone();
			}
			function ac() {
				var ao = U.corner,
					an = aa.options.position,
					am = an.at,
					ap = an.my.string ? an.my.string() : an.my;
				if (ao === N || (ap === N && am === N)) {
					return N;
				} else {
					if (ao === u) {
						Y.corner = new v.Corner(ap);
					} else {
						if (!ao.string) {
							Y.corner = new v.Corner(ao);
							Y.corner.fixed = u;
						}
					}
				}
				W.corner = new v.Corner(Y.corner.string());
				return Y.corner.string() !== "centercenter";
			}
			function ag(at, aq, an) {
				aq = !aq ? at[at.precedance] : aq;
				var am = ak.titlebar && at.y === C,
					ar = am ? ak.titlebar : R,
					ap = "border-" + aq + "-width",
					ao = function (av) {
						return parseInt(av.css(ap), 10);
					},
					au;
				al(function () {
					au = (an ? ao(an) : ao(ak.content) || ao(ar) || ao(R)) || 0;
				});
				return au;
			}
			function V(av) {
				var ao = ak.titlebar && av.y === C,
					an = ao ? ak.titlebar : ak.content,
					au = A.browser.mozilla,
					ar = au ? "-moz-" : A.browser.webkit ? "-webkit-" : "",
					aq = "border-radius-" + av.y + av.x,
					ap = "border-" + av.y + "-" + av.x + "-radius",
					at = function (aw) {
						return parseInt(an.css(aw), 10) || parseInt(R.css(aw), 10);
					},
					am;
				al(function () {
					am = at(ap) || at(ar + ap) || at(ar + aq) || at(aq) || 0;
				});
				return am;
			}
			function ai(az) {
				var aq,
					aA,
					ap,
					ax = ak.tip.css("cssText", ""),
					ay = az || Y.corner,
					at = /rgba?\(0, 0, 0(, 0)?\)|transparent|#123456/i,
					am = "border-" + ay[ay.precedance] + "-color",
					av = "background-color",
					aB = "transparent",
					ao = " !important",
					au = ak.titlebar,
					aw =
						au &&
						(ay.y === C ||
							(ay.y === x &&
								ax.position().top + X.height / 2 + U.offset <
									au.outerHeight(u))),
					an = aw ? au : ak.content;
				function ar(aC, aF, aD) {
					var aE = aC.css(aF) || aB;
					if (aD && aE === aC.css(aD)) {
						return N;
					} else {
						return at.test(aE) ? N : aE;
					}
				}
				al(function () {
					af.fill =
						ar(ax, av) ||
						ar(an, av) ||
						ar(ak.content, av) ||
						ar(R, av) ||
						ax.css(av);
					af.border =
						ar(ax, am, "color") ||
						ar(an, am, "color") ||
						ar(ak.content, am, "color") ||
						ar(R, am, "color") ||
						R.css(am);
					A("*", ax)
						.add(ax)
						.css("cssText", av + ":" + aB + ao + ";border:0" + ao + ";");
				});
			}
			function ah(aw) {
				var au = aw.precedance === d,
					an = X[au ? g : z],
					ax = X[au ? z : g],
					at = aw.string().indexOf(x) > -1,
					am = an * (at ? 0.5 : 1),
					ap = Math.pow,
					ay = Math.round,
					av,
					ar,
					az,
					ao = Math.sqrt(ap(am, 2) + ap(ax, 2)),
					aq = [(ad / am) * ao, (ad / ax) * ao];
				aq[2] = Math.sqrt(ap(aq[0], 2) - ap(ad, 2));
				aq[3] = Math.sqrt(ap(aq[1], 2) - ap(ad, 2));
				av = ao + aq[2] + aq[3] + (at ? 0 : aq[0]);
				ar = av / ao;
				az = [ay(ar * ax), ay(ar * an)];
				return { height: az[au ? 0 : 1], width: az[au ? 1 : 0] };
			}
			function Z(am, ao, an) {
				return (
					"<qvml:" +
					am +
					' xmlns="urn:schemas-microsoft.com:vml" class="qtip-vml" ' +
					(ao || "") +
					' style="behavior: url(#default#VML); ' +
					(an || "") +
					'" />'
				);
			}
			A.extend(Y, {
				init: function () {
					var am = ac() && (ab || A.browser.msie);
					if (am) {
						Y.create();
						Y.update();
						R.unbind(T).bind("tooltipmove" + T, ae);
					}
					return am;
				},
				create: function () {
					var ao = X.width,
						an = X.height,
						am;
					if (ak.tip) {
						ak.tip.remove();
					}
					ak.tip = A("<div />", { class: "qtip-tip" })
						.css({ width: ao, height: an })
						.prependTo(R);
					if (ab) {
						A("<canvas />").appendTo(ak.tip)[0].getContext("2d").save();
					} else {
						am = Z("shape", 'coordorigin="0,0"', "position:absolute;");
						ak.tip.html(am + am);
						A("*", ak.tip).bind("click mousedown", function (ap) {
							ap.stopPropagation();
						});
					}
				},
				update: function (av, aq) {
					var au = ak.tip,
						ay = au.children(),
						ao = X.width,
						aw = X.height,
						az = U.mimic,
						ax = Math.round,
						am,
						an,
						at,
						ap,
						ar;
					if (!av) {
						av = W.corner || Y.corner;
					}
					if (az === N) {
						az = av;
					} else {
						az = new v.Corner(az);
						az.precedance = av.precedance;
						if (az.x === "inherit") {
							az.x = av.x;
						} else {
							if (az.y === "inherit") {
								az.y = av.y;
							} else {
								if (az.x === az.y) {
									az[av.precedance] = av[av.precedance];
								}
							}
						}
					}
					am = az.precedance;
					if (av.precedance === e) {
						S();
					} else {
						P();
					}
					ak.tip.css({ width: (ao = X.width), height: (aw = X.height) });
					ai(av);
					if (af.border !== "transparent") {
						ad = ag(av, w);
						if (U.border === 0 && ad > 0) {
							af.fill = af.border;
						}
						Y.border = ad = U.border !== u ? U.border : ad;
					} else {
						Y.border = ad = 0;
					}
					at = p(az, ao, aw);
					Y.size = ar = ah(av);
					au.css(ar).css("line-height", ar.height + "px");
					if (av.precedance === d) {
						ap = [
							ax(
								az.x === r
									? ad
									: az.x === O
									? ar.width - ao - ad
									: (ar.width - ao) / 2,
							),
							ax(az.y === C ? ar.height - aw : 0),
						];
					} else {
						ap = [
							ax(az.x === r ? ar.width - ao : 0),
							ax(
								az.y === C
									? ad
									: az.y === y
									? ar.height - aw - ad
									: (ar.height - aw) / 2,
							),
						];
					}
					if (ab) {
						ay.attr(ar);
						an = ay[0].getContext("2d");
						an.restore();
						an.save();
						an.clearRect(0, 0, 3000, 3000);
						an.fillStyle = af.fill;
						an.strokeStyle = af.border;
						an.lineWidth = ad * 2;
						an.lineJoin = "miter";
						an.miterLimit = 100;
						an.translate(ap[0], ap[1]);
						an.beginPath();
						an.moveTo(at[0][0], at[0][1]);
						an.lineTo(at[1][0], at[1][1]);
						an.lineTo(at[2][0], at[2][1]);
						an.closePath();
						if (ad) {
							if (R.css("background-clip") === "border-box") {
								an.strokeStyle = af.fill;
								an.stroke();
							}
							an.strokeStyle = af.border;
							an.stroke();
						}
						an.fill();
					} else {
						at =
							"m" +
							at[0][0] +
							"," +
							at[0][1] +
							" l" +
							at[1][0] +
							"," +
							at[1][1] +
							" " +
							at[2][0] +
							"," +
							at[2][1] +
							" xe";
						ap[2] =
							ad && /^(r|b)/i.test(av.string())
								? parseFloat(A.browser.version, 10) === 8
									? 2
									: 1
								: 0;
						ay.css({
							coordsize: ao + ad + " " + (aw + ad),
							antialias: "" + (az.string().indexOf(x) > -1),
							left: ap[0],
							top: ap[1],
							width: ao + ad,
							height: aw + ad,
						}).each(function (aA) {
							var aB = A(this);
							aB[aB.prop ? "prop" : "attr"]({
								coordsize: ao + ad + " " + (aw + ad),
								path: at,
								fillcolor: af.fill,
								filled: !!aA,
								stroked: !aA,
							}).toggle(!!(ad || aA));
							if (!aA && aB.html() === "") {
								aB.html(
									Z(
										"stroke",
										'weight="' +
											ad * 2 +
											'px" color="' +
											af.border +
											'" miterlimit="1000" joinstyle="miter"',
									),
								);
							}
						});
					}
					if (aq !== N) {
						Y.position(av);
					}
				},
				position: function (ar) {
					var at = ak.tip,
						an = {},
						am = Math.max(0, U.offset),
						ao,
						aq,
						ap;
					if (U.corner === N || !at) {
						return N;
					}
					ar = ar || Y.corner;
					ao = ar.precedance;
					aq = ah(ar);
					ap = [ar.x, ar.y];
					if (ao === e) {
						ap.reverse();
					}
					A.each(ap, function (ax, aw) {
						var au, ay, av;
						if (aw === x) {
							au = ao === d ? r : C;
							an[au] = "50%";
							an["margin-" + au] = -Math.round(aq[ao === d ? g : z] / 2) + am;
						} else {
							au = ag(ar, aw);
							ay = ag(ar, aw, ak.content);
							av = V(ar);
							an[aw] = ax ? ay : am + (av > au ? av : -au);
						}
					});
					an[ar[ao]] -= aq[ao === e ? g : z];
					at.css({ top: "", bottom: "", left: "", right: "", margin: "" }).css(
						an,
					);
					return an;
				},
				destroy: function () {
					if (ak.tip) {
						ak.tip.remove();
					}
					ak.tip = false;
					R.unbind(T);
				},
			});
			Y.init();
		}
		v.tip = function (Q) {
			var P = Q.plugins.tip;
			return "object" === typeof P ? P : (Q.plugins.tip = new I(Q));
		};
		v.tip.initialize = "render";
		v.tip.sanitize = function (P) {
			var Q = P.style,
				R;
			if (Q && "tip" in Q) {
				R = P.style.tip;
				if (typeof R !== "object") {
					P.style.tip = { corner: R };
				}
				if (!/string|boolean/i.test(typeof R.corner)) {
					R.corner = u;
				}
				if (typeof R.width !== "number") {
					delete R.width;
				}
				if (typeof R.height !== "number") {
					delete R.height;
				}
				if (typeof R.border !== "number" && R.border !== u) {
					delete R.border;
				}
				if (typeof R.offset !== "number") {
					delete R.offset;
				}
			}
		};
		A.extend(u, J.defaults, {
			style: {
				tip: { corner: u, mimic: N, width: 6, height: 6, border: u, offset: 0 },
			},
		});
		function i(V) {
			var ac = this,
				ae = V.options.show.modal,
				P = V.elements,
				ad = P.tooltip,
				R = "#qtip-overlay",
				Q = ".qtipmodal",
				S = Q + V.id,
				W = "is-modal-qtip",
				U = A(a.body),
				ab = v.modal.focusable.join(","),
				Y = {},
				T;
			V.checks.modal = {
				"^show.modal.(on|blur)$": function () {
					ac.init();
					P.overlay.toggle(ad.is(":visible"));
				},
				"^content.text$": function () {
					aa();
				},
			};
			function aa() {
				Y = A(ab, ad)
					.not("[disabled]")
					.map(function () {
						return typeof this.focus === "function" ? this : null;
					});
			}
			function X(af) {
				if (Y.length < 1 && af.length) {
					af.not("body").blur();
				} else {
					Y.first().focus();
				}
			}
			function Z(ag) {
				var ah = A(ag.target),
					af = ah.closest(".qtip"),
					ai;
				ai =
					af.length < 1
						? N
						: parseInt(af[0].style.zIndex, 10) >
						  parseInt(ad[0].style.zIndex, 10);
				if (!ai && A(ag.target).closest(j)[0] !== ad[0]) {
					X(ah);
				}
			}
			A.extend(ac, {
				init: function () {
					if (!ae.on) {
						return ac;
					}
					T = ac.create();
					ad.attr(W, u)
						.css("z-index", v.modal.zindex + A(j + "[" + W + "]").length)
						.unbind(Q)
						.unbind(S)
						.bind(
							"tooltipshow" + Q + " tooltiphide" + Q,
							function (ah, ag, aj) {
								var af = ah.originalEvent;
								if (ah.target === ad[0]) {
									if (
										af &&
										ah.type === "tooltiphide" &&
										/mouse(leave|enter)/.test(af.type) &&
										A(af.relatedTarget).closest(T[0]).length
									) {
										try {
											ah.preventDefault();
										} catch (ai) {}
									} else {
										if (!af || (af && !af.solo)) {
											ac[ah.type.replace("tooltip", "")](ah, aj);
										}
									}
								}
							},
						)
						.bind("tooltipfocus" + Q, function (ah) {
							if (ah.isDefaultPrevented() || ah.target !== ad[0]) {
								return;
							}
							var ai = A(j).filter("[" + W + "]"),
								ag = v.modal.zindex + ai.length,
								af = parseInt(ad[0].style.zIndex, 10);
							T[0].style.zIndex = ag - 2;
							ai.each(function () {
								if (this.style.zIndex > af) {
									this.style.zIndex -= 1;
								}
							});
							ai.end()
								.filter("." + M)
								.qtip("blur", ah.originalEvent);
							ad.addClass(M)[0].style.zIndex = ag;
							try {
								ah.preventDefault();
							} catch (aj) {}
						})
						.bind("tooltiphide" + Q, function (af) {
							if (af.target === ad[0]) {
								A("[" + W + "]")
									.filter(":visible")
									.not(ad)
									.last()
									.qtip("focus", af);
							}
						});
					if (ae.escape) {
						A(a)
							.unbind(S)
							.bind("keydown" + S, function (af) {
								if (af.keyCode === 27 && ad.hasClass(M)) {
									V.hide(af);
								}
							});
					}
					if (ae.blur) {
						P.overlay.unbind(S).bind("click" + S, function (af) {
							if (ad.hasClass(M)) {
								V.hide(af);
							}
						});
					}
					aa();
					return ac;
				},
				create: function () {
					var ag = A(R),
						ah = A(b);
					if (ag.length) {
						return (P.overlay = ag.insertAfter(A(j).last()));
					}
					T = P.overlay = A("<div />", {
						id: R.substr(1),
						html: "<div></div>",
						mousedown: function () {
							return N;
						},
					})
						.hide()
						.insertAfter(A(j).last());
					function af() {
						T.css({ height: ah.height(), width: ah.width() });
					}
					ah.unbind(Q).bind("resize" + Q, af);
					af();
					return T;
				},
				toggle: function (aj, ak, al) {
					if (aj && aj.isDefaultPrevented()) {
						return ac;
					}
					var ai = ae.effect,
						ah = ak ? "show" : "hide",
						am = T.is(":visible"),
						ag = A("[" + W + "]")
							.filter(":visible")
							.not(ad),
						af;
					if (!T) {
						T = ac.create();
					}
					if (
						(T.is(":animated") && am === ak && T.data("toggleState") !== N) ||
						(!ak && ag.length)
					) {
						return ac;
					}
					if (ak) {
						T.css({ left: 0, top: 0 });
						T.toggleClass("blurs", ae.blur);
						if (ae.stealfocus !== N) {
							U.bind("focusin" + S, Z);
							X(A("body :focus"));
						}
					} else {
						U.unbind("focusin" + S);
					}
					T.stop(u, N).data("toggleState", ak);
					if (A.isFunction(ai)) {
						ai.call(T, ak);
					} else {
						if (ai === N) {
							T[ah]();
						} else {
							T.fadeTo(parseInt(al, 10) || 90, ak ? 1 : 0, function () {
								if (!ak) {
									A(this).hide();
								}
							});
						}
					}
					if (!ak) {
						T.queue(function (an) {
							T.css({ left: "", top: "" }).removeData("toggleState");
							an();
						});
					}
					return ac;
				},
				show: function (af, ag) {
					return ac.toggle(af, u, ag);
				},
				hide: function (af, ag) {
					return ac.toggle(af, N, ag);
				},
				destroy: function () {
					var af = T;
					if (af) {
						af = A("[" + W + "]").not(ad).length < 1;
						if (af) {
							P.overlay.remove();
							A(a).unbind(Q);
						} else {
							P.overlay.unbind(Q + V.id);
						}
						U.unbind("focusin" + S);
					}
					return ad.removeAttr(W).unbind(Q);
				},
			});
			ac.init();
		}
		v.modal = function (Q) {
			var P = Q.plugins.modal;
			return "object" === typeof P ? P : (Q.plugins.modal = new i(Q));
		};
		v.modal.initialize = "render";
		v.modal.sanitize = function (P) {
			if (P.show) {
				if (typeof P.show.modal !== "object") {
					P.show.modal = { on: !!P.show.modal };
				} else {
					if (typeof P.show.modal.on === "undefined") {
						P.show.modal.on = u;
					}
				}
			}
		};
		v.modal.zindex = J.zindex - 200;
		v.modal.focusable = [
			"a[href]",
			"area[href]",
			"input",
			"select",
			"textarea",
			"button",
			"iframe",
			"object",
			"embed",
			"[tabindex]",
			"[contenteditable]",
		];
		A.extend(u, J.defaults, {
			show: { modal: { on: N, effect: u, blur: u, stealfocus: u, escape: u } },
		});
		v.viewport = function (ae, am, ak, T, U, ai, ah) {
			var al = ak.target,
				S = ae.elements.tooltip,
				ac = ak.my,
				af = ak.at,
				ag = ak.adjust,
				P = ag.method.split(" "),
				Z = P[0],
				X = P[1] || P[0],
				aj = ak.viewport,
				aa = ak.container,
				ad = ae.cache,
				ab = ae.plugins.tip,
				R = { left: 0, top: 0 },
				Q,
				W,
				V;
			if (
				!aj.jquery ||
				al[0] === b ||
				al[0] === a.body ||
				ag.method === "none"
			) {
				return R;
			}
			Q = S.css("position") === "fixed";
			aj = {
				elem: aj,
				height: aj[(aj[0] === b ? "h" : "outerH") + "eight"](),
				width: aj[(aj[0] === b ? "w" : "outerW") + "idth"](),
				scrollleft: Q ? 0 : aj.scrollLeft(),
				scrolltop: Q ? 0 : aj.scrollTop(),
				offset: aj.offset() || { left: 0, top: 0 },
			};
			aa = {
				elem: aa,
				scrollLeft: aa.scrollLeft(),
				scrollTop: aa.scrollTop(),
				offset: aa.offset() || { left: 0, top: 0 },
			};
			function Y(ao, an, at, aF, ax, av, aE, aH, az) {
				var au = am[ax],
					aA = ac[ao],
					aG = af[ao],
					aI = at === D,
					aC = -aa.offset[ax] + aj.offset[ax] + aj["scroll" + ax],
					aw = aA === ax ? az : aA === av ? -az : -az / 2,
					aB = aG === ax ? aH : aG === av ? -aH : -aH / 2,
					ap = ab && ab.size ? ab.size[aE] || 0 : 0,
					aD = ab && ab.corner && ab.corner.precedance === ao && !aI ? ap : 0,
					ar = aC - au + aD,
					aq = au + az - aj[aE] - aC + aD,
					ay =
						aw -
						(ac.precedance === ao || aA === ac[an] ? aB : 0) -
						(aG === x ? aH / 2 : 0);
				if (aI) {
					aD = ab && ab.corner && ab.corner.precedance === an ? ap : 0;
					ay = (aA === ax ? 1 : -1) * aw - aD;
					am[ax] += ar > 0 ? ar : aq > 0 ? -aq : 0;
					am[ax] = Math.max(
						-aa.offset[ax] +
							aj.offset[ax] +
							(aD && ab.corner[ao] === x ? ab.offset : 0),
						au - ay,
						Math.min(
							Math.max(-aa.offset[ax] + aj.offset[ax] + aj[aE], au + ay),
							am[ax],
						),
					);
				} else {
					aF *= at === H ? 2 : 0;
					if (ar > 0 && (aA !== ax || aq > 0)) {
						am[ax] -= ay + aF;
						W["invert" + ao](ax);
					} else {
						if (aq > 0 && (aA !== av || ar > 0)) {
							am[ax] -= (aA === x ? -ay : ay) + aF;
							W["invert" + ao](av);
						}
					}
					if (am[ax] < aC && -am[ax] > aq) {
						am[ax] = au;
						W = ac.clone();
					}
				}
				return am[ax] - au;
			}
			if (Z !== "shift" || X !== "shift") {
				W = ac.clone();
			}
			R = {
				left: Z !== "none" ? Y(e, d, Z, ag.x, r, O, g, T, ai) : 0,
				top: X !== "none" ? Y(d, e, X, ag.y, C, y, z, U, ah) : 0,
			};
			if (W && ad.lastClass !== (V = h + "-pos-" + W.abbrev())) {
				S.removeClass(ae.cache.lastClass).addClass((ae.cache.lastClass = V));
			}
			return R;
		};
		v.imagemap = function (Y, R, ac, V) {
			if (!R.jquery) {
				R = A(R);
			}
			var Q = (Y.cache.areas = {}),
				aa = (R[0].shape || R.attr("shape")).toLowerCase(),
				Z = R[0].coords || R.attr("coords"),
				U = Z.split(","),
				ab = [],
				T = A('img[usemap="#' + R.parent("map").attr("name") + '"]'),
				ae = T.offset(),
				ad = {
					width: 0,
					height: 0,
					position: {
						top: 10000000000,
						right: 0,
						bottom: 0,
						left: 10000000000,
					},
				},
				W = 0,
				X = 0,
				P;
			function S(ao, am, an) {
				var aj = 0,
					al = 1,
					ak = 1,
					ai = 0,
					ag = 0,
					ah = ao.width,
					af = ao.height;
				while (ah > 0 && af > 0 && al > 0 && ak > 0) {
					ah = Math.floor(ah / 2);
					af = Math.floor(af / 2);
					if (an.x === r) {
						al = ah;
					} else {
						if (an.x === O) {
							al = ao.width - ah;
						} else {
							al += Math.floor(ah / 2);
						}
					}
					if (an.y === C) {
						ak = af;
					} else {
						if (an.y === y) {
							ak = ao.height - af;
						} else {
							ak += Math.floor(af / 2);
						}
					}
					aj = am.length;
					while (aj--) {
						if (am.length < 2) {
							break;
						}
						ai = am[aj][0] - ao.position.left;
						ag = am[aj][1] - ao.position.top;
						if (
							(an.x === r && ai >= al) ||
							(an.x === O && ai <= al) ||
							(an.x === x && (ai < al || ai > ao.width - al)) ||
							(an.y === C && ag >= ak) ||
							(an.y === y && ag <= ak) ||
							(an.y === x && (ag < ak || ag > ao.height - ak))
						) {
							am.splice(aj, 1);
						}
					}
				}
				return { left: am[0][0], top: am[0][1] };
			}
			ae.left += Math.ceil((T.outerWidth() - T.width()) / 2);
			ae.top += Math.ceil((T.outerHeight() - T.height()) / 2);
			if (aa === "poly") {
				W = U.length;
				while (W--) {
					X = [parseInt(U[--W], 10), parseInt(U[W + 1], 10)];
					if (X[0] > ad.position.right) {
						ad.position.right = X[0];
					}
					if (X[0] < ad.position.left) {
						ad.position.left = X[0];
					}
					if (X[1] > ad.position.bottom) {
						ad.position.bottom = X[1];
					}
					if (X[1] < ad.position.top) {
						ad.position.top = X[1];
					}
					ab.push(X);
				}
			} else {
				W = -1;
				while (W++ < U.length) {
					ab.push(parseInt(U[W], 10));
				}
			}
			switch (aa) {
				case "rect":
					ad = {
						width: Math.abs(ab[2] - ab[0]),
						height: Math.abs(ab[3] - ab[1]),
						position: {
							left: Math.min(ab[0], ab[2]),
							top: Math.min(ab[1], ab[3]),
						},
					};
					break;
				case "circle":
					ad = {
						width: ab[2] + 2,
						height: ab[2] + 2,
						position: { left: ab[0], top: ab[1] },
					};
					break;
				case "poly":
					ad.width = Math.abs(ad.position.right - ad.position.left);
					ad.height = Math.abs(ad.position.bottom - ad.position.top);
					if (ac.abbrev() === "c") {
						ad.position = {
							left: ad.position.left + ad.width / 2,
							top: ad.position.top + ad.height / 2,
						};
					} else {
						if (!Q[ac + Z]) {
							ad.position = S(ad, ab.slice(), ac);
							if (V && (V[0] === "flip" || V[1] === "flip")) {
								ad.offset = S(ad, ab.slice(), {
									x: ac.x === r ? O : ac.x === O ? r : x,
									y: ac.y === C ? y : ac.y === y ? C : x,
								});
								ad.offset.left -= ad.position.left;
								ad.offset.top -= ad.position.top;
							}
							Q[ac + Z] = ad;
						}
						ad = Q[ac + Z];
					}
					ad.width = ad.height = 0;
					break;
			}
			ad.position.left += ae.left;
			ad.position.top += ae.top;
			return ad;
		};
		function q(S) {
			var W = this,
				P = S.elements,
				Y = S.options,
				X = P.tooltip,
				R = ".ie6-" + S.id,
				U = A("select, object").length < 1,
				Q = 0,
				V = N,
				T;
			S.checks.ie6 = {
				"^content|style$": function (aa, ab, Z) {
					redraw();
				},
			};
			A.extend(W, {
				init: function () {
					var aa = A(b),
						Z;
					if (U) {
						P.bgiframe = A(
							'<iframe class="qtip-bgiframe" frameborder="0" tabindex="-1" src="javascript:\'\';"  style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=0); -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";"></iframe>',
						);
						P.bgiframe.appendTo(X);
						X.bind("tooltipmove" + R, W.adjustBGIFrame);
					}
					T = A("<div/>", { id: "qtip-rcontainer" }).appendTo(a.body);
					W.redraw();
					if (P.overlay && !V) {
						Z = function () {
							P.overlay[0].style.top = aa.scrollTop() + "px";
						};
						aa.bind("scroll.qtip-ie6, resize.qtip-ie6", Z);
						Z();
						P.overlay.addClass("qtipmodal-ie6fix");
						V = u;
					}
				},
				adjustBGIFrame: function () {
					var ab = S.get("dimensions"),
						aa = S.plugins.tip,
						ac = P.tip,
						Z,
						ad;
					ad = parseInt(X.css("border-left-width"), 10) || 0;
					ad = { left: -ad, top: -ad };
					if (aa && ac) {
						Z =
							aa.corner.precedance === "x"
								? ["width", "left"]
								: ["height", "top"];
						ad[Z[1]] -= ac[Z[0]]();
					}
					P.bgiframe.css(ad).css(ab);
				},
				redraw: function () {
					if (S.rendered < 1 || Q) {
						return W;
					}
					var ae = Y.style,
						aa = Y.position.container,
						ac,
						ad,
						Z,
						ab;
					Q = 1;
					if (ae.height) {
						X.css(z, ae.height);
					}
					if (ae.width) {
						X.css(g, ae.width);
					} else {
						X.css(g, "").appendTo(T);
						ad = X.width();
						if (ad % 2 < 1) {
							ad += 1;
						}
						Z = X.css("max-width") || "";
						ab = X.css("min-width") || "";
						ac = (Z + ab).indexOf("%") > -1 ? aa.width() / 100 : 0;
						Z = (Z.indexOf("%") > -1 ? ac : 1) * parseInt(Z, 10) || ad;
						ab = (ab.indexOf("%") > -1 ? ac : 1) * parseInt(ab, 10) || 0;
						ad = Z + ab ? Math.min(Math.max(ad, ab), Z) : ad;
						X.css(g, Math.round(ad)).appendTo(aa);
					}
					Q = 0;
					return W;
				},
				destroy: function () {
					if (U) {
						P.bgiframe.remove();
					}
					X.unbind(R);
				},
			});
			W.init();
		}
		v.ie6 = function (R) {
			var Q = A.browser,
				P = R.plugins.ie6;
			if (!(Q.msie && ("" + Q.version).charAt(0) === "6")) {
				return N;
			}
			return "object" === typeof P ? P : (R.plugins.ie6 = new q(R));
		};
		v.ie6.initialize = "render";
	});
})(window, document);
jQuery;

/*
 * jQuery Simply Countable plugin
 * Provides a character counter for any text input or textarea
 *
 * @version  0.4.2
 * @homepage http://github.com/aaronrussell/jquery-simply-countable/
 * @author   Aaron Russell (http://www.aaronrussell.co.uk)
 *
 * Copyright (c) 2009-2010 Aaron Russell (aaron@gc4.co.uk)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 */ (function ($) {
	$.fn.simplyCountable = function (options) {
		options = $.extend(
			{
				counter: "#counter",
				countType: "characters",
				wordSeparator: " ",
				maxCount: 140,
				strictMax: false,
				countDirection: "down",
				safeClass: "safe",
				overClass: "over",
				thousandSeparator: ",",
				onOverCount: function () {},
				onSafeCount: function () {},
				onMaxCount: function () {},
			},
			options,
		);
		var countable = this;
		var counter = $(options.counter);
		if (!counter.length) {
			return false;
		}
		regex = new RegExp("[" + options.wordSeparator + "]+");
		var countCheck = function () {
			var count;
			var revCount;
			var reverseCount = function (ct) {
				return ct - ct * 2 + options.maxCount;
			};
			var countInt = function () {
				return options.countDirection === "up" ? revCount : count;
			};
			var numberFormat = function (ct) {
				var prefix = "";
				if (options.thousandSeparator) {
					ct = ct.toString();
					if (ct.match(/^-/)) {
						ct = ct.substr(1);
						prefix = "-";
					}
					for (var i = ct.length - 3; i > 0; i -= 3) {
						ct = ct.substr(0, i) + options.thousandSeparator + ct.substr(i);
					}
				}
				return prefix + ct;
			};
			if (options.countType === "words") {
				count = options.maxCount - $.trim(countable.val()).split(regex).length;
				if (countable.val() === "") {
					count += 1;
				}
			} else {
				count = options.maxCount - countable.val().length;
			}
			revCount = reverseCount(count);
			if (options.strictMax && count <= 0) {
				var content = countable.val();
				if (
					count < 0 ||
					content.match(new RegExp("[" + options.wordSeparator + "]$"))
				) {
					options.onMaxCount(countInt(), countable, counter);
				}
				if (options.countType === "words") {
					countable.val(
						content
							.split(regex)
							.slice(0, options.maxCount)
							.join(options.wordSeparator),
					);
				} else {
					countable.val(content.substring(0, options.maxCount));
				}
				(count = 0), (revCount = options.maxCount);
			}
			counter.text(numberFormat(countInt()));
			if (
				!counter.hasClass(options.safeClass) &&
				!counter.hasClass(options.overClass)
			) {
				if (count < 0) {
					counter.addClass(options.overClass);
				} else {
					counter.addClass(options.safeClass);
				}
			} else if (count < 0 && counter.hasClass(options.safeClass)) {
				counter.removeClass(options.safeClass).addClass(options.overClass);
				options.onOverCount(countInt(), countable, counter);
			} else if (count >= 0 && counter.hasClass(options.overClass)) {
				counter.removeClass(options.overClass).addClass(options.safeClass);
				options.onSafeCount(countInt(), countable, counter);
			}
		};
		countCheck();
		countable.keyup(countCheck);
		countable.bind("paste keyup blur change", function () {
			setTimeout(countCheck, 5);
		});
	};
})(jQuery);

/*
	Masked Input plugin for jQuery
	Copyright (c) 2007-2013 Josh Bush (digitalbush.com)
	Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
	Version: 1.3.1
*/
(function (e) {
	function t() {
		var e = document.createElement("input"),
			t = "onpaste";
		return e.setAttribute(t, ""), "function" == typeof e[t] ? "paste" : "input";
	}
	var n,
		a = t() + ".mask",
		r = navigator.userAgent,
		i = /iphone/i.test(r),
		o = /android/i.test(r);
	(e.mask = {
		definitions: { 9: "[0-9]", a: "[A-Za-z]", "*": "[A-Za-z0-9]" },
		dataName: "rawMaskFn",
		placeholder: "_",
	}),
		e.fn.extend({
			caret: function (e, t) {
				var n;
				if (0 !== this.length && !this.is(":hidden"))
					return "number" == typeof e
						? ((t = "number" == typeof t ? t : e),
						  this.each(function () {
								this.setSelectionRange
									? this.setSelectionRange(e, t)
									: this.createTextRange &&
									  ((n = this.createTextRange()),
									  n.collapse(!0),
									  n.moveEnd("character", t),
									  n.moveStart("character", e),
									  n.select());
						  }))
						: (this[0].setSelectionRange
								? ((e = this[0].selectionStart), (t = this[0].selectionEnd))
								: document.selection &&
								  document.selection.createRange &&
								  ((n = document.selection.createRange()),
								  (e = 0 - n.duplicate().moveStart("character", -1e5)),
								  (t = e + n.text.length)),
						  { begin: e, end: t });
			},
			unmask: function () {
				return this.trigger("unmask");
			},
			mask: function (t, r) {
				var c, l, s, u, f, h;
				return !t && this.length > 0
					? ((c = e(this[0])), c.data(e.mask.dataName)())
					: ((r = e.extend(
							{ placeholder: e.mask.placeholder, completed: null },
							r,
					  )),
					  (l = e.mask.definitions),
					  (s = []),
					  (u = h = t.length),
					  (f = null),
					  e.each(t.split(""), function (e, t) {
							"?" == t
								? (h--, (u = e))
								: l[t]
								? (s.push(RegExp(l[t])), null === f && (f = s.length - 1))
								: s.push(null);
					  }),
					  this.trigger("unmask").each(function () {
							function c(e) {
								for (; h > ++e && !s[e]; );
								return e;
							}
							function d(e) {
								for (; --e >= 0 && !s[e]; );
								return e;
							}
							function m(e, t) {
								var n, a;
								if (!(0 > e)) {
									for (n = e, a = c(t); h > n; n++)
										if (s[n]) {
											if (!(h > a && s[n].test(R[a]))) break;
											(R[n] = R[a]), (R[a] = r.placeholder), (a = c(a));
										}
									b(), x.caret(Math.max(f, e));
								}
							}
							function p(e) {
								var t, n, a, i;
								for (t = e, n = r.placeholder; h > t; t++)
									if (s[t]) {
										if (
											((a = c(t)),
											(i = R[t]),
											(R[t] = n),
											!(h > a && s[a].test(i)))
										)
											break;
										n = i;
									}
							}
							function g(e) {
								var t,
									n,
									a,
									r = e.which;
								8 === r || 46 === r || (i && 127 === r)
									? ((t = x.caret()),
									  (n = t.begin),
									  (a = t.end),
									  0 === a - n &&
											((n = 46 !== r ? d(n) : (a = c(n - 1))),
											(a = 46 === r ? c(a) : a)),
									  k(n, a),
									  m(n, a - 1),
									  e.preventDefault())
									: 27 == r && (x.val(S), x.caret(0, y()), e.preventDefault());
							}
							function v(t) {
								var n,
									a,
									i,
									l = t.which,
									u = x.caret();
								t.ctrlKey ||
									t.altKey ||
									t.metaKey ||
									32 > l ||
									(l &&
										(0 !== u.end - u.begin &&
											(k(u.begin, u.end), m(u.begin, u.end - 1)),
										(n = c(u.begin - 1)),
										h > n &&
											((a = String.fromCharCode(l)),
											s[n].test(a) &&
												(p(n),
												(R[n] = a),
												b(),
												(i = c(n)),
												o
													? setTimeout(e.proxy(e.fn.caret, x, i), 0)
													: x.caret(i),
												r.completed && i >= h && r.completed.call(x))),
										t.preventDefault()));
							}
							function k(e, t) {
								var n;
								for (n = e; t > n && h > n; n++) s[n] && (R[n] = r.placeholder);
							}
							function b() {
								x.val(R.join(""));
							}
							function y(e) {
								var t,
									n,
									a = x.val(),
									i = -1;
								for (t = 0, pos = 0; h > t; t++)
									if (s[t]) {
										for (R[t] = r.placeholder; pos++ < a.length; )
											if (((n = a.charAt(pos - 1)), s[t].test(n))) {
												(R[t] = n), (i = t);
												break;
											}
										if (pos > a.length) break;
									} else R[t] === a.charAt(pos) && t !== u && (pos++, (i = t));
								return (
									e
										? b()
										: u > i + 1
										? (x.val(""), k(0, h))
										: (b(), x.val(x.val().substring(0, i + 1))),
									u ? t : f
								);
							}
							var x = e(this),
								R = e.map(t.split(""), function (e) {
									return "?" != e ? (l[e] ? r.placeholder : e) : void 0;
								}),
								S = x.val();
							x.data(e.mask.dataName, function () {
								return e
									.map(R, function (e, t) {
										return s[t] && e != r.placeholder ? e : null;
									})
									.join("");
							}),
								x.attr("readonly") ||
									x
										.one("unmask", function () {
											x.unbind(".mask").removeData(e.mask.dataName);
										})
										.bind("focus.mask", function () {
											clearTimeout(n);
											var e;
											(S = x.val()),
												(e = y()),
												(n = setTimeout(function () {
													b(), e == t.length ? x.caret(0, e) : x.caret(e);
												}, 10));
										})
										.bind("blur.mask", function () {
											y(), x.val() != S && x.change();
										})
										.bind("keydown.mask", g)
										.bind("keypress.mask", v)
										.bind(a, function () {
											setTimeout(function () {
												var e = y(!0);
												x.caret(e),
													r.completed &&
														e == x.val().length &&
														r.completed.call(x);
											}, 0);
										}),
								y();
					  }));
			},
		});
})(jQuery);

/*
 ### jQuery Star Rating Plugin v3.13 - 2009-03-26 ###
 * Home: http://www.fyneworks.com/jquery/star-rating/
 * Code: http://code.google.com/p/jquery-star-rating-plugin/
 *
	* Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 ###
*/
(function (a) {
	if (a.browser.msie)
		try {
			document.execCommand("BackgroundImageCache", false, true);
		} catch (b) {}
	a.fn.rating = function (b) {
		if (this.length == 0) return this;
		if (typeof arguments[0] == "string") {
			if (this.length > 1) {
				var c = arguments;
				return this.each(function () {
					a.fn.rating.apply(a(this), c);
				});
			}
			a.fn.rating[arguments[0]].apply(
				this,
				a.makeArray(arguments).slice(1) || [],
			);
			return this;
		}
		var b = a.extend({}, a.fn.rating.options, b || {});
		a.fn.rating.calls++;
		this.not(".star-rating-applied")
			.addClass("star-rating-applied")
			.each(function () {
				var c,
					d = a(this);
				var e = (this.name || "unnamed-rating")
					.replace(/\[|\]/g, "_")
					.replace(/^\_+|\_+$/g, "");
				var f = a(this.form || document.body);
				var g = f.data("rating");
				if (!g || g.call != a.fn.rating.calls)
					g = { count: 0, call: a.fn.rating.calls };
				var h = g[e];
				if (h) c = h.data("rating");
				if (h && c) c.count++;
				else {
					c = a.extend(
						{},
						b || {},
						(a.metadata ? d.metadata() : a.meta ? d.data() : null) || {},
						{ count: 0, stars: [], inputs: [] },
					);
					c.serial = g.count++;
					h = a('<span class="star-rating-control"/>');
					d.before(h);
					h.addClass("rating-to-be-drawn");
					if (d.attr("disabled")) c.readOnly = true;
					h.append(
						(c.cancel = a(
							'<div class="rating-cancel"><a title="' +
								c.cancel +
								'">' +
								c.cancelValue +
								"</a></div>",
						)
							.mouseover(function () {
								a(this).rating("drain");
								a(this).addClass("star-rating-hover");
							})
							.mouseout(function () {
								a(this).rating("draw");
								a(this).removeClass("star-rating-hover");
							})
							.click(function () {
								a(this).rating("select");
							})
							.data("rating", c)),
					);
				}
				var i = a(
					'<div class="star-rating rater-' +
						c.serial +
						'"><a title="' +
						(this.title || this.value) +
						'">' +
						this.value +
						"</a></div>",
				);
				h.append(i);
				if (this.id) i.attr("id", this.id);
				if (this.className) i.addClass(this.className);
				if (c.half) c.split = 2;
				if (typeof c.split == "number" && c.split > 0) {
					var j = (a.fn.width ? i.width() : 0) || c.starWidth;
					var k = c.count % c.split,
						l = Math.floor(j / c.split);
					i.width(l)
						.find("a")
						.css({ "margin-left": "-" + k * l + "px" });
				}
				if (c.readOnly) i.addClass("star-rating-readonly");
				else
					i.addClass("star-rating-live")
						.mouseover(function () {
							a(this).rating("fill");
							a(this).rating("focus");
						})
						.mouseout(function () {
							a(this).rating("draw");
							a(this).rating("blur");
						})
						.click(function () {
							a(this).rating("select");
						});
				if (this.checked) c.current = i;
				d.hide();
				d.change(function () {
					a(this).rating("select");
				});
				i.data("rating.input", d.data("rating.star", i));
				c.stars[c.stars.length] = i[0];
				c.inputs[c.inputs.length] = d[0];
				c.rater = g[e] = h;
				c.context = f;
				d.data("rating", c);
				h.data("rating", c);
				i.data("rating", c);
				f.data("rating", g);
			});
		a(".rating-to-be-drawn").rating("draw").removeClass("rating-to-be-drawn");
		return this;
	};
	a.extend(a.fn.rating, {
		calls: 0,
		focus: function () {
			var b = this.data("rating");
			if (!b) return this;
			if (!b.focus) return this;
			var c =
				a(this).data("rating.input") ||
				a(this.tagName == "INPUT" ? this : null);
			if (b.focus)
				b.focus.apply(c[0], [c.val(), a("a", c.data("rating.star"))[0]]);
		},
		blur: function () {
			var b = this.data("rating");
			if (!b) return this;
			if (!b.blur) return this;
			var c =
				a(this).data("rating.input") ||
				a(this.tagName == "INPUT" ? this : null);
			if (b.blur)
				b.blur.apply(c[0], [c.val(), a("a", c.data("rating.star"))[0]]);
		},
		fill: function () {
			var a = this.data("rating");
			if (!a) return this;
			if (a.readOnly) return;
			this.rating("drain");
			this.prevAll()
				.andSelf()
				.filter(".rater-" + a.serial)
				.addClass("star-rating-hover");
		},
		drain: function () {
			var a = this.data("rating");
			if (!a) return this;
			if (a.readOnly) return;
			a.rater
				.children()
				.filter(".rater-" + a.serial)
				.removeClass("star-rating-on")
				.removeClass("star-rating-hover");
		},
		draw: function () {
			var b = this.data("rating");
			if (!b) return this;
			this.rating("drain");
			if (b.current) {
				b.current.data("rating.input").attr("checked", "checked");
				b.current
					.prevAll()
					.andSelf()
					.filter(".rater-" + b.serial)
					.addClass("star-rating-on");
			} else a(b.inputs).removeAttr("checked");
			b.cancel[b.readOnly || b.required ? "hide" : "show"]();
			this.siblings()[b.readOnly ? "addClass" : "removeClass"](
				"star-rating-readonly",
			);
		},
		select: function (b, c) {
			var d = this.data("rating");
			if (!d) return this;
			if (d.readOnly) return;
			d.current = null;
			if (typeof b != "undefined") {
				if (typeof b == "number")
					return a(d.stars[b]).rating("select", undefined, c);
				if (typeof b == "string")
					a.each(d.stars, function () {
						if (a(this).data("rating.input").val() == b)
							a(this).rating("select", undefined, c);
					});
			} else
				d.current =
					this[0].tagName == "INPUT"
						? this.data("rating.star")
						: this.is(".rater-" + d.serial)
						? this
						: null;
			this.data("rating", d);
			this.rating("draw");
			var e = a(d.current ? d.current.data("rating.input") : null);
			if ((c || c == undefined) && d.callback)
				d.callback.apply(e[0], [e.val(), a("a", d.current)[0]]);
		},
		readOnly: function (b, c) {
			var d = this.data("rating");
			if (!d) return this;
			d.readOnly = b || b == undefined ? true : false;
			if (c) a(d.inputs).attr("disabled", "disabled");
			else a(d.inputs).removeAttr("disabled");
			this.data("rating", d);
			this.rating("draw");
		},
		disable: function () {
			this.rating("readOnly", true, true);
		},
		enable: function () {
			this.rating("readOnly", false, false);
		},
	});
	a.fn.rating.options = {
		cancel: "Cancel Rating",
		cancelValue: "",
		split: 0,
		starWidth: 16,
	};
})(jQuery);

/*
 * jQuery progressbar
 */
/* v 1.9.2 
(function(e,t){e.widget("ui.progressbar",{version:"1.9.2",options:{value:0,max:100},min:0,_create:function(){this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min,"aria-valuemax":this.options.max,"aria-valuenow":this._value()}),this.valueDiv=e("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element),this.oldValue=this._value(),this._refreshValue()},_destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.valueDiv.remove()},value:function(e){return e===t?this._value():(this._setOption("value",e),this)},_setOption:function(e,t){e==="value"&&(this.options.value=t,this._refreshValue(),this._value()===this.options.max&&this._trigger("complete")),this._super(e,t)},_value:function(){var e=this.options.value;return typeof e!="number"&&(e=0),Math.min(this.options.max,Math.max(this.min,e))},_percentage:function(){return 100*this._value()/this.options.max},_refreshValue:function(){var e=this.value(),t=this._percentage();this.oldValue!==e&&(this.oldValue=e,this._trigger("change")),this.valueDiv.toggle(e>this.min).toggleClass("ui-corner-right",e===this.options.max).width(t.toFixed(0)+"%"),this.element.attr("aria-valuenow",e)}})})(jQuery);
*/
/* v 1.8.16 */
(function (b, d) {
	b.widget("ui.progressbar", {
		options: { value: 0, max: 100 },
		min: 0,
		_create: function () {
			this.element
				.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all")
				.attr({
					role: "progressbar",
					"aria-valuemin": this.min,
					"aria-valuemax": this.options.max,
					"aria-valuenow": this._value(),
				});
			this.valueDiv = b(
				"<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>",
			).appendTo(this.element);
			this.oldValue = this._value();
			this._refreshValue();
		},
		destroy: function () {
			this.element
				.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all")
				.removeAttr("role")
				.removeAttr("aria-valuemin")
				.removeAttr("aria-valuemax")
				.removeAttr("aria-valuenow");
			this.valueDiv.remove();
			b.Widget.prototype.destroy.apply(this, arguments);
		},
		value: function (a) {
			if (a === d) return this._value();
			this._setOption("value", a);
			return this;
		},
		_setOption: function (a, c) {
			if (a === "value") {
				this.options.value = c;
				this._refreshValue();
				this._value() === this.options.max && this._trigger("complete");
			}
			b.Widget.prototype._setOption.apply(this, arguments);
		},
		_value: function () {
			var a = this.options.value;
			if (typeof a !== "number") a = 0;
			return Math.min(this.options.max, Math.max(this.min, a));
		},
		_percentage: function () {
			return (100 * this._value()) / this.options.max;
		},
		_refreshValue: function () {
			var a = this.value(),
				c = this._percentage();
			if (this.oldValue !== a) {
				this.oldValue = a;
				this._trigger("change");
			}
			this.valueDiv
				.toggle(a > this.min)
				.toggleClass("ui-corner-right", a === this.options.max)
				.width(c.toFixed(0) + "%");
			this.element.attr("aria-valuenow", a);
		},
	});
	b.extend(b.ui.progressbar, { version: "1.8.16" });
})(jQuery);
/* v 1.7.2 
(function(a){a.widget("ui.progressbar",{_init:function(){this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this._valueMin(),"aria-valuemax":this._valueMax(),"aria-valuenow":this._value()});this.valueDiv=a('<div class="ui-progressbar-value ui-widget-header ui-corner-left"></div>').appendTo(this.element);this._refreshValue()},destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow").removeData("progressbar").unbind(".progressbar");this.valueDiv.remove();a.widget.prototype.destroy.apply(this,arguments)},value:function(b){if(b===undefined){return this._value()}this._setData("value",b);return this},_setData:function(b,c){switch(b){case"value":this.options.value=c;this._refreshValue();this._trigger("change",null,{});break}a.widget.prototype._setData.apply(this,arguments)},_value:function(){var b=this.options.value;if(b<this._valueMin()){b=this._valueMin()}if(b>this._valueMax()){b=this._valueMax()}return b},_valueMin:function(){var b=0;return b},_valueMax:function(){var b=100;return b},_refreshValue:function(){var b=this.value();this.valueDiv[b==this._valueMax()?"addClass":"removeClass"]("ui-corner-right");this.valueDiv.width(b+"%");this.element.attr("aria-valuenow",b)}});a.extend(a.ui.progressbar,{version:"1.7.2",defaults:{value:0}})})(jQuery);
*/
/*
 * jQuery timepicker addon
 * By: Trent Richardson [http://trentrichardson.com]
 * Version 1.0.1
 * Last Modified: 07/01/2012
 *
 * Copyright 2012 Trent Richardson
 * You may use this project under MIT or GPL licenses.
 * http://trentrichardson.com/Impromptu/GPL-LICENSE.txt
 * http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
 *
 * HERES THE CSS:
 * .ui-timepicker-div .ui-widget-header { margin-bottom: 8px; }
 * .ui-timepicker-div dl { text-align: left; }
 * .ui-timepicker-div dl dt { height: 25px; margin-bottom: -25px; }
 * .ui-timepicker-div dl dd { margin: 0 10px 10px 65px; }
 * .ui-timepicker-div td { font-size: 90%; }
 * .ui-tpicker-grid-label { background: none; border: none; margin: 0; padding: 0; }
 */

/*jslint evil: true, maxlen: 300, white: false, undef: false, nomen: false, onevar: false */

(function ($) {
	$.ui.timepicker = $.ui.timepicker || {};
	if ($.ui.timepicker.version) {
		return;
	}
	$.extend($.ui, { timepicker: { version: "1.0.1" } });
	function Timepicker() {
		this.regional = [];
		this.regional[""] = {
			currentText: "Now",
			closeText: "Done",
			ampm: false,
			amNames: ["AM", "A"],
			pmNames: ["PM", "P"],
			timeFormat: "hh:mm tt",
			timeSuffix: "",
			timeOnlyTitle: "Choose Time",
			timeText: "Time",
			hourText: "Hour",
			minuteText: "Minute",
			secondText: "Second",
			millisecText: "Millisecond",
			timezoneText: "Time Zone",
		};
		this._defaults = {
			showButtonPanel: true,
			timeOnly: false,
			showHour: true,
			showMinute: true,
			showSecond: false,
			showMillisec: false,
			showTimezone: false,
			showTime: true,
			stepHour: 1,
			stepMinute: 1,
			stepSecond: 1,
			stepMillisec: 1,
			hour: 0,
			minute: 0,
			second: 0,
			millisec: 0,
			timezone: null,
			useLocalTimezone: false,
			defaultTimezone: "+0000",
			hourMin: 0,
			minuteMin: 0,
			secondMin: 0,
			millisecMin: 0,
			hourMax: 23,
			minuteMax: 59,
			secondMax: 59,
			millisecMax: 999,
			minDateTime: null,
			maxDateTime: null,
			onSelect: null,
			hourGrid: 0,
			minuteGrid: 0,
			secondGrid: 0,
			millisecGrid: 0,
			alwaysSetTime: true,
			separator: " ",
			altFieldTimeOnly: true,
			showTimepicker: true,
			timezoneIso8601: false,
			timezoneList: null,
			addSliderAccess: false,
			sliderAccessArgs: null,
		};
		$.extend(this._defaults, this.regional[""]);
	}
	$.extend(Timepicker.prototype, {
		$input: null,
		$altInput: null,
		$timeObj: null,
		inst: null,
		hour_slider: null,
		minute_slider: null,
		second_slider: null,
		millisec_slider: null,
		timezone_select: null,
		hour: 0,
		minute: 0,
		second: 0,
		millisec: 0,
		timezone: null,
		defaultTimezone: "+0000",
		hourMinOriginal: null,
		minuteMinOriginal: null,
		secondMinOriginal: null,
		millisecMinOriginal: null,
		hourMaxOriginal: null,
		minuteMaxOriginal: null,
		secondMaxOriginal: null,
		millisecMaxOriginal: null,
		ampm: "",
		formattedDate: "",
		formattedTime: "",
		formattedDateTime: "",
		timezoneList: null,
		setDefaults: function (settings) {
			extendRemove(this._defaults, settings || {});
			return this;
		},
		_newInst: function ($input, o) {
			var tp_inst = new Timepicker(),
				inlineSettings = {};
			for (var attrName in this._defaults) {
				var attrValue = $input.attr("time:" + attrName);
				if (attrValue) {
					try {
						inlineSettings[attrName] = eval(attrValue);
					} catch (err) {
						inlineSettings[attrName] = attrValue;
					}
				}
			}
			tp_inst._defaults = $.extend({}, this._defaults, inlineSettings, o, {
				beforeShow: function (input, dp_inst) {
					if ($.isFunction(o.beforeShow)) {
						return o.beforeShow(input, dp_inst, tp_inst);
					}
				},
				onChangeMonthYear: function (year, month, dp_inst) {
					tp_inst._updateDateTime(dp_inst);
					if ($.isFunction(o.onChangeMonthYear)) {
						o.onChangeMonthYear.call($input[0], year, month, dp_inst, tp_inst);
					}
				},
				onClose: function (dateText, dp_inst) {
					if (tp_inst.timeDefined === true && $input.val() !== "") {
						tp_inst._updateDateTime(dp_inst);
					}
					if ($.isFunction(o.onClose)) {
						o.onClose.call($input[0], dateText, dp_inst, tp_inst);
					}
				},
				timepicker: tp_inst,
			});
			tp_inst.amNames = $.map(tp_inst._defaults.amNames, function (val) {
				return val.toUpperCase();
			});
			tp_inst.pmNames = $.map(tp_inst._defaults.pmNames, function (val) {
				return val.toUpperCase();
			});
			if (tp_inst._defaults.timezoneList === null) {
				var timezoneList = [];
				for (var i = -11; i <= 12; i++) {
					timezoneList.push(
						(i >= 0 ? "+" : "-") +
							("0" + Math.abs(i).toString()).slice(-2) +
							"00",
					);
				}
				if (tp_inst._defaults.timezoneIso8601) {
					timezoneList = $.map(timezoneList, function (val) {
						return val == "+0000"
							? "Z"
							: val.substring(0, 3) + ":" + val.substring(3);
					});
				}
				tp_inst._defaults.timezoneList = timezoneList;
			}
			tp_inst.timezone = tp_inst._defaults.timezone;
			tp_inst.hour = tp_inst._defaults.hour;
			tp_inst.minute = tp_inst._defaults.minute;
			tp_inst.second = tp_inst._defaults.second;
			tp_inst.millisec = tp_inst._defaults.millisec;
			tp_inst.ampm = "";
			tp_inst.$input = $input;
			if (o.altField) {
				tp_inst.$altInput = $(o.altField)
					.css({ cursor: "pointer" })
					.focus(function () {
						$input.trigger("focus");
					});
			}
			if (
				tp_inst._defaults.minDate === 0 ||
				tp_inst._defaults.minDateTime === 0
			) {
				tp_inst._defaults.minDate = new Date();
			}
			if (
				tp_inst._defaults.maxDate === 0 ||
				tp_inst._defaults.maxDateTime === 0
			) {
				tp_inst._defaults.maxDate = new Date();
			}
			if (
				tp_inst._defaults.minDate !== undefined &&
				tp_inst._defaults.minDate instanceof Date
			) {
				tp_inst._defaults.minDateTime = new Date(
					tp_inst._defaults.minDate.getTime(),
				);
			}
			if (
				tp_inst._defaults.minDateTime !== undefined &&
				tp_inst._defaults.minDateTime instanceof Date
			) {
				tp_inst._defaults.minDate = new Date(
					tp_inst._defaults.minDateTime.getTime(),
				);
			}
			if (
				tp_inst._defaults.maxDate !== undefined &&
				tp_inst._defaults.maxDate instanceof Date
			) {
				tp_inst._defaults.maxDateTime = new Date(
					tp_inst._defaults.maxDate.getTime(),
				);
			}
			if (
				tp_inst._defaults.maxDateTime !== undefined &&
				tp_inst._defaults.maxDateTime instanceof Date
			) {
				tp_inst._defaults.maxDate = new Date(
					tp_inst._defaults.maxDateTime.getTime(),
				);
			}
			return tp_inst;
		},
		_addTimePicker: function (dp_inst) {
			var currDT =
				this.$altInput && this._defaults.altFieldTimeOnly
					? this.$input.val() + " " + this.$altInput.val()
					: this.$input.val();
			this.timeDefined = this._parseTime(currDT);
			this._limitMinMaxDateTime(dp_inst, false);
			this._injectTimePicker();
		},
		_parseTime: function (timeString, withDate) {
			if (!this.inst) {
				this.inst = $.datepicker._getInst(this.$input[0]);
			}
			if (withDate || !this._defaults.timeOnly) {
				var dp_dateFormat = $.datepicker._get(this.inst, "dateFormat");
				try {
					var parseRes = parseDateTimeInternal(
						dp_dateFormat,
						this._defaults.timeFormat,
						timeString,
						$.datepicker._getFormatConfig(this.inst),
						this._defaults,
					);
					if (!parseRes.timeObj) {
						return false;
					}
					$.extend(this, parseRes.timeObj);
				} catch (err) {
					return false;
				}
				return true;
			} else {
				var timeObj = $.datepicker.parseTime(
					this._defaults.timeFormat,
					timeString,
					this._defaults,
				);
				if (!timeObj) {
					return false;
				}
				$.extend(this, timeObj);
				return true;
			}
		},
		_injectTimePicker: function () {
			var $dp = this.inst.dpDiv,
				o = this._defaults,
				tp_inst = this,
				hourMax = parseInt(
					o.hourMax - ((o.hourMax - o.hourMin) % o.stepHour),
					10,
				),
				minMax = parseInt(
					o.minuteMax - ((o.minuteMax - o.minuteMin) % o.stepMinute),
					10,
				),
				secMax = parseInt(
					o.secondMax - ((o.secondMax - o.secondMin) % o.stepSecond),
					10,
				),
				millisecMax = parseInt(
					o.millisecMax - ((o.millisecMax - o.millisecMin) % o.stepMillisec),
					10,
				),
				dp_id = this.inst.id.toString().replace(/([^A-Za-z0-9_])/g, "");
			if (
				$dp.find("div#ui-timepicker-div-" + dp_id).length === 0 &&
				o.showTimepicker
			) {
				var noDisplay = ' style="display:none;"',
					html =
						'<div class="ui-timepicker-div" id="ui-timepicker-div-' +
						dp_id +
						'"><dl><dt class="ui_tpicker_time_label" id="ui_tpicker_time_label_' +
						dp_id +
						'"' +
						(o.showTime ? "" : noDisplay) +
						">" +
						o.timeText +
						'</dt><dd class="ui_tpicker_time" id="ui_tpicker_time_' +
						dp_id +
						'"' +
						(o.showTime ? "" : noDisplay) +
						'></dd><dt class="ui_tpicker_hour_label" id="ui_tpicker_hour_label_' +
						dp_id +
						'"' +
						(o.showHour ? "" : noDisplay) +
						">" +
						o.hourText +
						"</dt>",
					hourGridSize = 0,
					minuteGridSize = 0,
					secondGridSize = 0,
					millisecGridSize = 0,
					size = null;
				html +=
					'<dd class="ui_tpicker_hour"><div id="ui_tpicker_hour_' +
					dp_id +
					'"' +
					(o.showHour ? "" : noDisplay) +
					"></div>";
				if (o.showHour && o.hourGrid > 0) {
					html +=
						'<div style="padding-left: 1px"><table class="ui-tpicker-grid-label"><tr>';
					for (var h = o.hourMin; h <= hourMax; h += parseInt(o.hourGrid, 10)) {
						hourGridSize++;
						var tmph = o.ampm && h > 12 ? h - 12 : h;
						if (tmph < 10) {
							tmph = "0" + tmph;
						}
						if (o.ampm) {
							if (h === 0) {
								tmph = 12 + "a";
							} else {
								if (h < 12) {
									tmph += "a";
								} else {
									tmph += "p";
								}
							}
						}
						html += "<td>" + tmph + "</td>";
					}
					html += "</tr></table></div>";
				}
				html += "</dd>";
				html +=
					'<dt class="ui_tpicker_minute_label" id="ui_tpicker_minute_label_' +
					dp_id +
					'"' +
					(o.showMinute ? "" : noDisplay) +
					">" +
					o.minuteText +
					'</dt><dd class="ui_tpicker_minute"><div id="ui_tpicker_minute_' +
					dp_id +
					'"' +
					(o.showMinute ? "" : noDisplay) +
					"></div>";
				if (o.showMinute && o.minuteGrid > 0) {
					html +=
						'<div style="padding-left: 1px"><table class="ui-tpicker-grid-label"><tr>';
					for (
						var m = o.minuteMin;
						m <= minMax;
						m += parseInt(o.minuteGrid, 10)
					) {
						minuteGridSize++;
						html += "<td>" + (m < 10 ? "0" : "") + m + "</td>";
					}
					html += "</tr></table></div>";
				}
				html += "</dd>";
				html +=
					'<dt class="ui_tpicker_second_label" id="ui_tpicker_second_label_' +
					dp_id +
					'"' +
					(o.showSecond ? "" : noDisplay) +
					">" +
					o.secondText +
					'</dt><dd class="ui_tpicker_second"><div id="ui_tpicker_second_' +
					dp_id +
					'"' +
					(o.showSecond ? "" : noDisplay) +
					"></div>";
				if (o.showSecond && o.secondGrid > 0) {
					html += '<div style="padding-left: 1px"><table><tr>';
					for (
						var s = o.secondMin;
						s <= secMax;
						s += parseInt(o.secondGrid, 10)
					) {
						secondGridSize++;
						html += "<td>" + (s < 10 ? "0" : "") + s + "</td>";
					}
					html += "</tr></table></div>";
				}
				html += "</dd>";
				html +=
					'<dt class="ui_tpicker_millisec_label" id="ui_tpicker_millisec_label_' +
					dp_id +
					'"' +
					(o.showMillisec ? "" : noDisplay) +
					">" +
					o.millisecText +
					'</dt><dd class="ui_tpicker_millisec"><div id="ui_tpicker_millisec_' +
					dp_id +
					'"' +
					(o.showMillisec ? "" : noDisplay) +
					"></div>";
				if (o.showMillisec && o.millisecGrid > 0) {
					html += '<div style="padding-left: 1px"><table><tr>';
					for (
						var l = o.millisecMin;
						l <= millisecMax;
						l += parseInt(o.millisecGrid, 10)
					) {
						millisecGridSize++;
						html += "<td>" + (l < 10 ? "0" : "") + l + "</td>";
					}
					html += "</tr></table></div>";
				}
				html += "</dd>";
				html +=
					'<dt class="ui_tpicker_timezone_label" id="ui_tpicker_timezone_label_' +
					dp_id +
					'"' +
					(o.showTimezone ? "" : noDisplay) +
					">" +
					o.timezoneText +
					"</dt>";
				html +=
					'<dd class="ui_tpicker_timezone" id="ui_tpicker_timezone_' +
					dp_id +
					'"' +
					(o.showTimezone ? "" : noDisplay) +
					"></dd>";
				html += "</dl></div>";
				var $tp = $(html);
				if (o.timeOnly === true) {
					$tp.prepend(
						'<div class="ui-widget-header ui-helper-clearfix ui-corner-all"><div class="ui-datepicker-title">' +
							o.timeOnlyTitle +
							"</div></div>",
					);
					$dp.find(".ui-datepicker-header, .ui-datepicker-calendar").hide();
				}
				this.hour_slider = $tp.find("#ui_tpicker_hour_" + dp_id).slider({
					orientation: "horizontal",
					value: this.hour,
					min: o.hourMin,
					max: hourMax,
					step: o.stepHour,
					slide: function (event, ui) {
						tp_inst.hour_slider.slider("option", "value", ui.value);
						tp_inst._onTimeChange();
					},
				});
				this.minute_slider = $tp.find("#ui_tpicker_minute_" + dp_id).slider({
					orientation: "horizontal",
					value: this.minute,
					min: o.minuteMin,
					max: minMax,
					step: o.stepMinute,
					slide: function (event, ui) {
						tp_inst.minute_slider.slider("option", "value", ui.value);
						tp_inst._onTimeChange();
					},
				});
				this.second_slider = $tp.find("#ui_tpicker_second_" + dp_id).slider({
					orientation: "horizontal",
					value: this.second,
					min: o.secondMin,
					max: secMax,
					step: o.stepSecond,
					slide: function (event, ui) {
						tp_inst.second_slider.slider("option", "value", ui.value);
						tp_inst._onTimeChange();
					},
				});
				this.millisec_slider = $tp
					.find("#ui_tpicker_millisec_" + dp_id)
					.slider({
						orientation: "horizontal",
						value: this.millisec,
						min: o.millisecMin,
						max: millisecMax,
						step: o.stepMillisec,
						slide: function (event, ui) {
							tp_inst.millisec_slider.slider("option", "value", ui.value);
							tp_inst._onTimeChange();
						},
					});
				this.timezone_select = $tp
					.find("#ui_tpicker_timezone_" + dp_id)
					.append("<select></select>")
					.find("select");
				$.fn.append.apply(
					this.timezone_select,
					$.map(o.timezoneList, function (val, idx) {
						return $("<option />")
							.val(typeof val == "object" ? val.value : val)
							.text(typeof val == "object" ? val.label : val);
					}),
				);
				if (
					typeof this.timezone != "undefined" &&
					this.timezone !== null &&
					this.timezone !== ""
				) {
					var local_date = new Date(
						this.inst.selectedYear,
						this.inst.selectedMonth,
						this.inst.selectedDay,
						12,
					);
					var local_timezone = timeZoneString(local_date);
					if (local_timezone == this.timezone) {
						selectLocalTimeZone(tp_inst);
					} else {
						this.timezone_select.val(this.timezone);
					}
				} else {
					if (
						typeof this.hour != "undefined" &&
						this.hour !== null &&
						this.hour !== ""
					) {
						this.timezone_select.val(o.defaultTimezone);
					} else {
						selectLocalTimeZone(tp_inst);
					}
				}
				this.timezone_select.change(function () {
					tp_inst._defaults.useLocalTimezone = false;
					tp_inst._onTimeChange();
				});
				if (o.showHour && o.hourGrid > 0) {
					size = (100 * hourGridSize * o.hourGrid) / (hourMax - o.hourMin);
					$tp
						.find(".ui_tpicker_hour table")
						.css({
							width: size + "%",
							marginLeft: size / (-2 * hourGridSize) + "%",
							borderCollapse: "collapse",
						})
						.find("td")
						.each(function (index) {
							$(this)
								.click(function () {
									var h = $(this).html();
									if (o.ampm) {
										var ap = h.substring(2).toLowerCase(),
											aph = parseInt(h.substring(0, 2), 10);
										if (ap == "a") {
											if (aph == 12) {
												h = 0;
											} else {
												h = aph;
											}
										} else {
											if (aph == 12) {
												h = 12;
											} else {
												h = aph + 12;
											}
										}
									}
									tp_inst.hour_slider.slider("option", "value", h);
									tp_inst._onTimeChange();
									tp_inst._onSelectHandler();
								})
								.css({
									cursor: "pointer",
									width: 100 / hourGridSize + "%",
									textAlign: "center",
									overflow: "hidden",
								});
						});
				}
				if (o.showMinute && o.minuteGrid > 0) {
					size = (100 * minuteGridSize * o.minuteGrid) / (minMax - o.minuteMin);
					$tp
						.find(".ui_tpicker_minute table")
						.css({
							width: size + "%",
							marginLeft: size / (-2 * minuteGridSize) + "%",
							borderCollapse: "collapse",
						})
						.find("td")
						.each(function (index) {
							$(this)
								.click(function () {
									tp_inst.minute_slider.slider(
										"option",
										"value",
										$(this).html(),
									);
									tp_inst._onTimeChange();
									tp_inst._onSelectHandler();
								})
								.css({
									cursor: "pointer",
									width: 100 / minuteGridSize + "%",
									textAlign: "center",
									overflow: "hidden",
								});
						});
				}
				if (o.showSecond && o.secondGrid > 0) {
					$tp
						.find(".ui_tpicker_second table")
						.css({
							width: size + "%",
							marginLeft: size / (-2 * secondGridSize) + "%",
							borderCollapse: "collapse",
						})
						.find("td")
						.each(function (index) {
							$(this)
								.click(function () {
									tp_inst.second_slider.slider(
										"option",
										"value",
										$(this).html(),
									);
									tp_inst._onTimeChange();
									tp_inst._onSelectHandler();
								})
								.css({
									cursor: "pointer",
									width: 100 / secondGridSize + "%",
									textAlign: "center",
									overflow: "hidden",
								});
						});
				}
				if (o.showMillisec && o.millisecGrid > 0) {
					$tp
						.find(".ui_tpicker_millisec table")
						.css({
							width: size + "%",
							marginLeft: size / (-2 * millisecGridSize) + "%",
							borderCollapse: "collapse",
						})
						.find("td")
						.each(function (index) {
							$(this)
								.click(function () {
									tp_inst.millisec_slider.slider(
										"option",
										"value",
										$(this).html(),
									);
									tp_inst._onTimeChange();
									tp_inst._onSelectHandler();
								})
								.css({
									cursor: "pointer",
									width: 100 / millisecGridSize + "%",
									textAlign: "center",
									overflow: "hidden",
								});
						});
				}
				var $buttonPanel = $dp.find(".ui-datepicker-buttonpane");
				if ($buttonPanel.length) {
					$buttonPanel.before($tp);
				} else {
					$dp.append($tp);
				}
				this.$timeObj = $tp.find("#ui_tpicker_time_" + dp_id);
				if (this.inst !== null) {
					var timeDefined = this.timeDefined;
					this._onTimeChange();
					this.timeDefined = timeDefined;
				}
				var onSelectDelegate = function () {
					tp_inst._onSelectHandler();
				};
				this.hour_slider.bind("slidestop", onSelectDelegate);
				this.minute_slider.bind("slidestop", onSelectDelegate);
				this.second_slider.bind("slidestop", onSelectDelegate);
				this.millisec_slider.bind("slidestop", onSelectDelegate);
				if (this._defaults.addSliderAccess) {
					var sliderAccessArgs = this._defaults.sliderAccessArgs;
					setTimeout(function () {
						if ($tp.find(".ui-slider-access").length === 0) {
							$tp.find(".ui-slider:visible").sliderAccess(sliderAccessArgs);
							var sliderAccessWidth = $tp
								.find(".ui-slider-access:eq(0)")
								.outerWidth(true);
							if (sliderAccessWidth) {
								$tp.find("table:visible").each(function () {
									var $g = $(this),
										oldWidth = $g.outerWidth(),
										oldMarginLeft = $g
											.css("marginLeft")
											.toString()
											.replace("%", ""),
										newWidth = oldWidth - sliderAccessWidth,
										newMarginLeft = (oldMarginLeft * newWidth) / oldWidth + "%";
									$g.css({ width: newWidth, marginLeft: newMarginLeft });
								});
							}
						}
					}, 0);
				}
			}
		},
		_limitMinMaxDateTime: function (dp_inst, adjustSliders) {
			var o = this._defaults,
				dp_date = new Date(
					dp_inst.selectedYear,
					dp_inst.selectedMonth,
					dp_inst.selectedDay,
				);
			if (!this._defaults.showTimepicker) {
				return;
			}
			if (
				$.datepicker._get(dp_inst, "minDateTime") !== null &&
				$.datepicker._get(dp_inst, "minDateTime") !== undefined &&
				dp_date
			) {
				var minDateTime = $.datepicker._get(dp_inst, "minDateTime"),
					minDateTimeDate = new Date(
						minDateTime.getFullYear(),
						minDateTime.getMonth(),
						minDateTime.getDate(),
						0,
						0,
						0,
						0,
					);
				if (
					this.hourMinOriginal === null ||
					this.minuteMinOriginal === null ||
					this.secondMinOriginal === null ||
					this.millisecMinOriginal === null
				) {
					this.hourMinOriginal = o.hourMin;
					this.minuteMinOriginal = o.minuteMin;
					this.secondMinOriginal = o.secondMin;
					this.millisecMinOriginal = o.millisecMin;
				}
				if (
					dp_inst.settings.timeOnly ||
					minDateTimeDate.getTime() == dp_date.getTime()
				) {
					this._defaults.hourMin = minDateTime.getHours();
					if (this.hour <= this._defaults.hourMin) {
						this.hour = this._defaults.hourMin;
						this._defaults.minuteMin = minDateTime.getMinutes();
						if (this.minute <= this._defaults.minuteMin) {
							this.minute = this._defaults.minuteMin;
							this._defaults.secondMin = minDateTime.getSeconds();
						} else {
							if (this.second <= this._defaults.secondMin) {
								this.second = this._defaults.secondMin;
								this._defaults.millisecMin = minDateTime.getMilliseconds();
							} else {
								if (this.millisec < this._defaults.millisecMin) {
									this.millisec = this._defaults.millisecMin;
								}
								this._defaults.millisecMin = this.millisecMinOriginal;
							}
						}
					} else {
						this._defaults.minuteMin = this.minuteMinOriginal;
						this._defaults.secondMin = this.secondMinOriginal;
						this._defaults.millisecMin = this.millisecMinOriginal;
					}
				} else {
					this._defaults.hourMin = this.hourMinOriginal;
					this._defaults.minuteMin = this.minuteMinOriginal;
					this._defaults.secondMin = this.secondMinOriginal;
					this._defaults.millisecMin = this.millisecMinOriginal;
				}
			}
			if (
				$.datepicker._get(dp_inst, "maxDateTime") !== null &&
				$.datepicker._get(dp_inst, "maxDateTime") !== undefined &&
				dp_date
			) {
				var maxDateTime = $.datepicker._get(dp_inst, "maxDateTime"),
					maxDateTimeDate = new Date(
						maxDateTime.getFullYear(),
						maxDateTime.getMonth(),
						maxDateTime.getDate(),
						0,
						0,
						0,
						0,
					);
				if (
					this.hourMaxOriginal === null ||
					this.minuteMaxOriginal === null ||
					this.secondMaxOriginal === null
				) {
					this.hourMaxOriginal = o.hourMax;
					this.minuteMaxOriginal = o.minuteMax;
					this.secondMaxOriginal = o.secondMax;
					this.millisecMaxOriginal = o.millisecMax;
				}
				if (
					dp_inst.settings.timeOnly ||
					maxDateTimeDate.getTime() == dp_date.getTime()
				) {
					this._defaults.hourMax = maxDateTime.getHours();
					if (this.hour >= this._defaults.hourMax) {
						this.hour = this._defaults.hourMax;
						this._defaults.minuteMax = maxDateTime.getMinutes();
						if (this.minute >= this._defaults.minuteMax) {
							this.minute = this._defaults.minuteMax;
							this._defaults.secondMax = maxDateTime.getSeconds();
						} else {
							if (this.second >= this._defaults.secondMax) {
								this.second = this._defaults.secondMax;
								this._defaults.millisecMax = maxDateTime.getMilliseconds();
							} else {
								if (this.millisec > this._defaults.millisecMax) {
									this.millisec = this._defaults.millisecMax;
								}
								this._defaults.millisecMax = this.millisecMaxOriginal;
							}
						}
					} else {
						this._defaults.minuteMax = this.minuteMaxOriginal;
						this._defaults.secondMax = this.secondMaxOriginal;
						this._defaults.millisecMax = this.millisecMaxOriginal;
					}
				} else {
					this._defaults.hourMax = this.hourMaxOriginal;
					this._defaults.minuteMax = this.minuteMaxOriginal;
					this._defaults.secondMax = this.secondMaxOriginal;
					this._defaults.millisecMax = this.millisecMaxOriginal;
				}
			}
			if (adjustSliders !== undefined && adjustSliders === true) {
				var hourMax = parseInt(
						this._defaults.hourMax -
							((this._defaults.hourMax - this._defaults.hourMin) %
								this._defaults.stepHour),
						10,
					),
					minMax = parseInt(
						this._defaults.minuteMax -
							((this._defaults.minuteMax - this._defaults.minuteMin) %
								this._defaults.stepMinute),
						10,
					),
					secMax = parseInt(
						this._defaults.secondMax -
							((this._defaults.secondMax - this._defaults.secondMin) %
								this._defaults.stepSecond),
						10,
					),
					millisecMax = parseInt(
						this._defaults.millisecMax -
							((this._defaults.millisecMax - this._defaults.millisecMin) %
								this._defaults.stepMillisec),
						10,
					);
				if (this.hour_slider) {
					this.hour_slider
						.slider("option", { min: this._defaults.hourMin, max: hourMax })
						.slider("value", this.hour);
				}
				if (this.minute_slider) {
					this.minute_slider
						.slider("option", { min: this._defaults.minuteMin, max: minMax })
						.slider("value", this.minute);
				}
				if (this.second_slider) {
					this.second_slider
						.slider("option", { min: this._defaults.secondMin, max: secMax })
						.slider("value", this.second);
				}
				if (this.millisec_slider) {
					this.millisec_slider
						.slider("option", {
							min: this._defaults.millisecMin,
							max: millisecMax,
						})
						.slider("value", this.millisec);
				}
			}
		},
		_onTimeChange: function () {
			var hour = this.hour_slider ? this.hour_slider.slider("value") : false,
				minute = this.minute_slider
					? this.minute_slider.slider("value")
					: false,
				second = this.second_slider
					? this.second_slider.slider("value")
					: false,
				millisec = this.millisec_slider
					? this.millisec_slider.slider("value")
					: false,
				timezone = this.timezone_select ? this.timezone_select.val() : false,
				o = this._defaults;
			if (typeof hour == "object") {
				hour = false;
			}
			if (typeof minute == "object") {
				minute = false;
			}
			if (typeof second == "object") {
				second = false;
			}
			if (typeof millisec == "object") {
				millisec = false;
			}
			if (typeof timezone == "object") {
				timezone = false;
			}
			if (hour !== false) {
				hour = parseInt(hour, 10);
			}
			if (minute !== false) {
				minute = parseInt(minute, 10);
			}
			if (second !== false) {
				second = parseInt(second, 10);
			}
			if (millisec !== false) {
				millisec = parseInt(millisec, 10);
			}
			var ampm = o[hour < 12 ? "amNames" : "pmNames"][0];
			var hasChanged =
				hour != this.hour ||
				minute != this.minute ||
				second != this.second ||
				millisec != this.millisec ||
				(this.ampm.length > 0 &&
					hour < 12 !=
						($.inArray(this.ampm.toUpperCase(), this.amNames) !== -1)) ||
				timezone != this.timezone;
			if (hasChanged) {
				if (hour !== false) {
					this.hour = hour;
				}
				if (minute !== false) {
					this.minute = minute;
				}
				if (second !== false) {
					this.second = second;
				}
				if (millisec !== false) {
					this.millisec = millisec;
				}
				if (timezone !== false) {
					this.timezone = timezone;
				}
				if (!this.inst) {
					this.inst = $.datepicker._getInst(this.$input[0]);
				}
				this._limitMinMaxDateTime(this.inst, true);
			}
			if (o.ampm) {
				this.ampm = ampm;
			}
			this.formattedTime = $.datepicker.formatTime(
				this._defaults.timeFormat,
				this,
				this._defaults,
			);
			if (this.$timeObj) {
				this.$timeObj.text(this.formattedTime + o.timeSuffix);
			}
			this.timeDefined = true;
			if (hasChanged) {
				this._updateDateTime();
			}
		},
		_onSelectHandler: function () {
			var onSelect = this._defaults.onSelect;
			var inputEl = this.$input ? this.$input[0] : null;
			if (onSelect && inputEl) {
				onSelect.apply(inputEl, [this.formattedDateTime, this]);
			}
		},
		_formatTime: function (time, format) {
			time = time || {
				hour: this.hour,
				minute: this.minute,
				second: this.second,
				millisec: this.millisec,
				ampm: this.ampm,
				timezone: this.timezone,
			};
			var tmptime = (format || this._defaults.timeFormat).toString();
			tmptime = $.datepicker.formatTime(tmptime, time, this._defaults);
			if (arguments.length) {
				return tmptime;
			} else {
				this.formattedTime = tmptime;
			}
		},
		_updateDateTime: function (dp_inst) {
			dp_inst = this.inst || dp_inst;
			var dt = $.datepicker._daylightSavingAdjust(
					new Date(
						dp_inst.selectedYear,
						dp_inst.selectedMonth,
						dp_inst.selectedDay,
					),
				),
				dateFmt = $.datepicker._get(dp_inst, "dateFormat"),
				formatCfg = $.datepicker._getFormatConfig(dp_inst),
				timeAvailable = dt !== null && this.timeDefined;
			this.formattedDate = $.datepicker.formatDate(
				dateFmt,
				dt === null ? new Date() : dt,
				formatCfg,
			);
			var formattedDateTime = this.formattedDate;
			if (this._defaults.timeOnly === true) {
				formattedDateTime = this.formattedTime;
			} else {
				if (
					this._defaults.timeOnly !== true &&
					(this._defaults.alwaysSetTime || timeAvailable)
				) {
					formattedDateTime +=
						this._defaults.separator +
						this.formattedTime +
						this._defaults.timeSuffix;
				}
			}
			this.formattedDateTime = formattedDateTime;
			if (!this._defaults.showTimepicker) {
				this.$input.val(this.formattedDate);
			} else {
				if (this.$altInput && this._defaults.altFieldTimeOnly === true) {
					this.$altInput.val(this.formattedTime);
					this.$input.val(this.formattedDate);
				} else {
					if (this.$altInput) {
						this.$altInput.val(formattedDateTime);
						this.$input.val(formattedDateTime);
					} else {
						this.$input.val(formattedDateTime);
					}
				}
			}
			this.$input.trigger("change");
		},
	});
	$.fn.extend({
		timepicker: function (o) {
			o = o || {};
			var tmp_args = arguments;
			if (typeof o == "object") {
				tmp_args[0] = $.extend(o, { timeOnly: true });
			}
			return $(this).each(function () {
				$.fn.datetimepicker.apply($(this), tmp_args);
			});
		},
		datetimepicker: function (o) {
			o = o || {};
			var tmp_args = arguments;
			if (typeof o == "string") {
				if (o == "getDate") {
					return $.fn.datepicker.apply($(this[0]), tmp_args);
				} else {
					return this.each(function () {
						var $t = $(this);
						$t.datepicker.apply($t, tmp_args);
					});
				}
			} else {
				return this.each(function () {
					var $t = $(this);
					$t.datepicker($.timepicker._newInst($t, o)._defaults);
				});
			}
		},
	});
	$.datepicker.parseDateTime = function (
		dateFormat,
		timeFormat,
		dateTimeString,
		dateSettings,
		timeSettings,
	) {
		var parseRes = parseDateTimeInternal(
			dateFormat,
			timeFormat,
			dateTimeString,
			dateSettings,
			timeSettings,
		);
		if (parseRes.timeObj) {
			var t = parseRes.timeObj;
			parseRes.date.setHours(t.hour, t.minute, t.second, t.millisec);
		}
		return parseRes.date;
	};
	$.datepicker.parseTime = function (timeFormat, timeString, options) {
		var getPatternAmpm = function (amNames, pmNames) {
			var markers = [];
			if (amNames) {
				$.merge(markers, amNames);
			}
			if (pmNames) {
				$.merge(markers, pmNames);
			}
			markers = $.map(markers, function (val) {
				return val.replace(/[.*+?|()\[\]{}\\]/g, "\\$&");
			});
			return "(" + markers.join("|") + ")?";
		};
		var getFormatPositions = function (timeFormat) {
			var finds = timeFormat
					.toLowerCase()
					.match(/(h{1,2}|m{1,2}|s{1,2}|l{1}|t{1,2}|z)/g),
				orders = { h: -1, m: -1, s: -1, l: -1, t: -1, z: -1 };
			if (finds) {
				for (var i = 0; i < finds.length; i++) {
					if (orders[finds[i].toString().charAt(0)] == -1) {
						orders[finds[i].toString().charAt(0)] = i + 1;
					}
				}
			}
			return orders;
		};
		var o = extendRemove(
			extendRemove({}, $.timepicker._defaults),
			options || {},
		);
		var regstr =
				"^" +
				timeFormat
					.toString()
					.replace(/h{1,2}/gi, "(\\d?\\d)")
					.replace(/m{1,2}/gi, "(\\d?\\d)")
					.replace(/s{1,2}/gi, "(\\d?\\d)")
					.replace(/l{1}/gi, "(\\d?\\d?\\d)")
					.replace(/t{1,2}/gi, getPatternAmpm(o.amNames, o.pmNames))
					.replace(/z{1}/gi, "(z|[-+]\\d\\d:?\\d\\d)?")
					.replace(/\s/g, "\\s?") +
				o.timeSuffix +
				"$",
			order = getFormatPositions(timeFormat),
			ampm = "",
			treg;
		treg = timeString.match(new RegExp(regstr, "i"));
		var resTime = { hour: 0, minute: 0, second: 0, millisec: 0 };
		if (treg) {
			if (order.t !== -1) {
				if (treg[order.t] === undefined || treg[order.t].length === 0) {
					ampm = "";
					resTime.ampm = "";
				} else {
					ampm = $.inArray(treg[order.t], o.amNames) !== -1 ? "AM" : "PM";
					resTime.ampm = o[ampm == "AM" ? "amNames" : "pmNames"][0];
				}
			}
			if (order.h !== -1) {
				if (ampm == "AM" && treg[order.h] == "12") {
					resTime.hour = 0;
				} else {
					if (ampm == "PM" && treg[order.h] != "12") {
						resTime.hour = parseInt(treg[order.h], 10) + 12;
					} else {
						resTime.hour = Number(treg[order.h]);
					}
				}
			}
			if (order.m !== -1) {
				resTime.minute = Number(treg[order.m]);
			}
			if (order.s !== -1) {
				resTime.second = Number(treg[order.s]);
			}
			if (order.l !== -1) {
				resTime.millisec = Number(treg[order.l]);
			}
			if (order.z !== -1 && treg[order.z] !== undefined) {
				var tz = treg[order.z].toUpperCase();
				switch (tz.length) {
					case 1:
						tz = o.timezoneIso8601 ? "Z" : "+0000";
						break;
					case 5:
						if (o.timezoneIso8601) {
							tz =
								tz.substring(1) == "0000"
									? "Z"
									: tz.substring(0, 3) + ":" + tz.substring(3);
						}
						break;
					case 6:
						if (!o.timezoneIso8601) {
							tz =
								tz == "Z" || tz.substring(1) == "00:00"
									? "+0000"
									: tz.replace(/:/, "");
						} else {
							if (tz.substring(1) == "00:00") {
								tz = "Z";
							}
						}
						break;
				}
				resTime.timezone = tz;
			}
			return resTime;
		}
		return false;
	};
	$.datepicker.formatTime = function (format, time, options) {
		options = options || {};
		options = $.extend($.timepicker._defaults, options);
		time = $.extend(
			{ hour: 0, minute: 0, second: 0, millisec: 0, timezone: "+0000" },
			time,
		);
		var tmptime = format;
		var ampmName = options.amNames[0];
		var hour = parseInt(time.hour, 10);
		if (options.ampm) {
			if (hour > 11) {
				ampmName = options.pmNames[0];
				if (hour > 12) {
					hour = hour % 12;
				}
			}
			if (hour === 0) {
				hour = 12;
			}
		}
		tmptime = tmptime.replace(
			/(?:hh?|mm?|ss?|[tT]{1,2}|[lz])/g,
			function (match) {
				switch (match.toLowerCase()) {
					case "hh":
						return ("0" + hour).slice(-2);
					case "h":
						return hour;
					case "mm":
						return ("0" + time.minute).slice(-2);
					case "m":
						return time.minute;
					case "ss":
						return ("0" + time.second).slice(-2);
					case "s":
						return time.second;
					case "l":
						return ("00" + time.millisec).slice(-3);
					case "z":
						return time.timezone;
					case "t":
					case "tt":
						if (options.ampm) {
							if (match.length == 1) {
								ampmName = ampmName.charAt(0);
							}
							return match.charAt(0) == "T"
								? ampmName.toUpperCase()
								: ampmName.toLowerCase();
						}
						return "";
				}
			},
		);
		tmptime = $.trim(tmptime);
		return tmptime;
	};
	$.datepicker._base_selectDate = $.datepicker._selectDate;
	$.datepicker._selectDate = function (id, dateStr) {
		var inst = this._getInst($(id)[0]),
			tp_inst = this._get(inst, "timepicker");
		if (tp_inst) {
			tp_inst._limitMinMaxDateTime(inst, true);
			inst.inline = inst.stay_open = true;
			this._base_selectDate(id, dateStr);
			inst.inline = inst.stay_open = false;
			this._notifyChange(inst);
			this._updateDatepicker(inst);
		} else {
			this._base_selectDate(id, dateStr);
		}
	};
	$.datepicker._base_updateDatepicker = $.datepicker._updateDatepicker;
	$.datepicker._updateDatepicker = function (inst) {
		var input = inst.input[0];
		if (
			$.datepicker._curInst &&
			$.datepicker._curInst != inst &&
			$.datepicker._datepickerShowing &&
			$.datepicker._lastInput != input
		) {
			return;
		}
		if (typeof inst.stay_open !== "boolean" || inst.stay_open === false) {
			this._base_updateDatepicker(inst);
			var tp_inst = this._get(inst, "timepicker");
			if (tp_inst) {
				tp_inst._addTimePicker(inst);
				if (tp_inst._defaults.useLocalTimezone) {
					var date = new Date(
						inst.selectedYear,
						inst.selectedMonth,
						inst.selectedDay,
						12,
					);
					selectLocalTimeZone(tp_inst, date);
					tp_inst._onTimeChange();
				}
			}
		}
	};
	$.datepicker._base_doKeyPress = $.datepicker._doKeyPress;
	$.datepicker._doKeyPress = function (event) {
		var inst = $.datepicker._getInst(event.target),
			tp_inst = $.datepicker._get(inst, "timepicker");
		if (tp_inst) {
			if ($.datepicker._get(inst, "constrainInput")) {
				var ampm = tp_inst._defaults.ampm,
					dateChars = $.datepicker._possibleChars(
						$.datepicker._get(inst, "dateFormat"),
					),
					datetimeChars =
						tp_inst._defaults.timeFormat
							.toString()
							.replace(/[hms]/g, "")
							.replace(/TT/g, ampm ? "APM" : "")
							.replace(/Tt/g, ampm ? "AaPpMm" : "")
							.replace(/tT/g, ampm ? "AaPpMm" : "")
							.replace(/T/g, ampm ? "AP" : "")
							.replace(/tt/g, ampm ? "apm" : "")
							.replace(/t/g, ampm ? "ap" : "") +
						" " +
						tp_inst._defaults.separator +
						tp_inst._defaults.timeSuffix +
						(tp_inst._defaults.showTimezone
							? tp_inst._defaults.timezoneList.join("")
							: "") +
						tp_inst._defaults.amNames.join("") +
						tp_inst._defaults.pmNames.join("") +
						dateChars,
					chr = String.fromCharCode(
						event.charCode === undefined ? event.keyCode : event.charCode,
					);
				return (
					event.ctrlKey ||
					chr < " " ||
					!dateChars ||
					datetimeChars.indexOf(chr) > -1
				);
			}
		}
		return $.datepicker._base_doKeyPress(event);
	};
	$.datepicker._base_doKeyUp = $.datepicker._doKeyUp;
	$.datepicker._doKeyUp = function (event) {
		var inst = $.datepicker._getInst(event.target),
			tp_inst = $.datepicker._get(inst, "timepicker");
		if (tp_inst) {
			if (tp_inst._defaults.timeOnly && inst.input.val() != inst.lastVal) {
				try {
					$.datepicker._updateDatepicker(inst);
				} catch (err) {
					$.datepicker.log(err);
				}
			}
		}
		return $.datepicker._base_doKeyUp(event);
	};
	$.datepicker._base_gotoToday = $.datepicker._gotoToday;
	$.datepicker._gotoToday = function (id) {
		var inst = this._getInst($(id)[0]),
			$dp = inst.dpDiv;
		this._base_gotoToday(id);
		var tp_inst = this._get(inst, "timepicker");
		selectLocalTimeZone(tp_inst);
		var now = new Date();
		this._setTime(inst, now);
		$(".ui-datepicker-today", $dp).click();
	};
	$.datepicker._disableTimepickerDatepicker = function (target) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}
		var tp_inst = this._get(inst, "timepicker");
		$(target).datepicker("getDate");
		if (tp_inst) {
			tp_inst._defaults.showTimepicker = false;
			tp_inst._updateDateTime(inst);
		}
	};
	$.datepicker._enableTimepickerDatepicker = function (target) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}
		var tp_inst = this._get(inst, "timepicker");
		$(target).datepicker("getDate");
		if (tp_inst) {
			tp_inst._defaults.showTimepicker = true;
			tp_inst._addTimePicker(inst);
			tp_inst._updateDateTime(inst);
		}
	};
	$.datepicker._setTime = function (inst, date) {
		var tp_inst = this._get(inst, "timepicker");
		if (tp_inst) {
			var defaults = tp_inst._defaults,
				hour = date ? date.getHours() : defaults.hour,
				minute = date ? date.getMinutes() : defaults.minute,
				second = date ? date.getSeconds() : defaults.second,
				millisec = date ? date.getMilliseconds() : defaults.millisec;
			var hourEq = hour === defaults.hourMin,
				minuteEq = minute === defaults.minuteMin,
				secondEq = second === defaults.secondMin;
			var reset = false;
			if (hour < defaults.hourMin || hour > defaults.hourMax) {
				reset = true;
			} else {
				if (
					(minute < defaults.minuteMin || minute > defaults.minuteMax) &&
					hourEq
				) {
					reset = true;
				} else {
					if (
						(second < defaults.secondMin || second > defaults.secondMax) &&
						hourEq &&
						minuteEq
					) {
						reset = true;
					} else {
						if (
							(millisec < defaults.millisecMin ||
								millisec > defaults.millisecMax) &&
							hourEq &&
							minuteEq &&
							secondEq
						) {
							reset = true;
						}
					}
				}
			}
			if (reset) {
				hour = defaults.hourMin;
				minute = defaults.minuteMin;
				second = defaults.secondMin;
				millisec = defaults.millisecMin;
			}
			tp_inst.hour = hour;
			tp_inst.minute = minute;
			tp_inst.second = second;
			tp_inst.millisec = millisec;
			if (tp_inst.hour_slider) {
				tp_inst.hour_slider.slider("value", hour);
			}
			if (tp_inst.minute_slider) {
				tp_inst.minute_slider.slider("value", minute);
			}
			if (tp_inst.second_slider) {
				tp_inst.second_slider.slider("value", second);
			}
			if (tp_inst.millisec_slider) {
				tp_inst.millisec_slider.slider("value", millisec);
			}
			tp_inst._onTimeChange();
			tp_inst._updateDateTime(inst);
		}
	};
	$.datepicker._setTimeDatepicker = function (target, date, withDate) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}
		var tp_inst = this._get(inst, "timepicker");
		if (tp_inst) {
			this._setDateFromField(inst);
			var tp_date;
			if (date) {
				if (typeof date == "string") {
					tp_inst._parseTime(date, withDate);
					tp_date = new Date();
					tp_date.setHours(
						tp_inst.hour,
						tp_inst.minute,
						tp_inst.second,
						tp_inst.millisec,
					);
				} else {
					tp_date = new Date(date.getTime());
				}
				if (tp_date.toString() == "Invalid Date") {
					tp_date = undefined;
				}
				this._setTime(inst, tp_date);
			}
		}
	};
	$.datepicker._base_setDateDatepicker = $.datepicker._setDateDatepicker;
	$.datepicker._setDateDatepicker = function (target, date) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}
		var tp_date = date instanceof Date ? new Date(date.getTime()) : date;
		this._updateDatepicker(inst);
		this._base_setDateDatepicker.apply(this, arguments);
		this._setTimeDatepicker(target, tp_date, true);
	};
	$.datepicker._base_getDateDatepicker = $.datepicker._getDateDatepicker;
	$.datepicker._getDateDatepicker = function (target, noDefault) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}
		var tp_inst = this._get(inst, "timepicker");
		if (tp_inst) {
			this._setDateFromField(inst, noDefault);
			var date = this._getDate(inst);
			if (date && tp_inst._parseTime($(target).val(), tp_inst.timeOnly)) {
				date.setHours(
					tp_inst.hour,
					tp_inst.minute,
					tp_inst.second,
					tp_inst.millisec,
				);
			}
			return date;
		}
		return this._base_getDateDatepicker(target, noDefault);
	};
	$.datepicker._base_parseDate = $.datepicker.parseDate;
	$.datepicker.parseDate = function (format, value, settings) {
		var splitRes = splitDateTime(format, value, settings);
		return $.datepicker._base_parseDate(format, splitRes[0], settings);
	};
	$.datepicker._base_formatDate = $.datepicker._formatDate;
	$.datepicker._formatDate = function (inst, day, month, year) {
		var tp_inst = this._get(inst, "timepicker");
		if (tp_inst) {
			tp_inst._updateDateTime(inst);
			return tp_inst.$input.val();
		}
		return this._base_formatDate(inst);
	};
	$.datepicker._base_optionDatepicker = $.datepicker._optionDatepicker;
	$.datepicker._optionDatepicker = function (target, name, value) {
		var inst = this._getInst(target);
		if (!inst) {
			return null;
		}
		var tp_inst = this._get(inst, "timepicker");
		if (tp_inst) {
			var min = null,
				max = null,
				onselect = null;
			if (typeof name == "string") {
				if (name === "minDate" || name === "minDateTime") {
					min = value;
				} else {
					if (name === "maxDate" || name === "maxDateTime") {
						max = value;
					} else {
						if (name === "onSelect") {
							onselect = value;
						}
					}
				}
			} else {
				if (typeof name == "object") {
					if (name.minDate) {
						min = name.minDate;
					} else {
						if (name.minDateTime) {
							min = name.minDateTime;
						} else {
							if (name.maxDate) {
								max = name.maxDate;
							} else {
								if (name.maxDateTime) {
									max = name.maxDateTime;
								}
							}
						}
					}
				}
			}
			if (min) {
				if (min === 0) {
					min = new Date();
				} else {
					min = new Date(min);
				}
				tp_inst._defaults.minDate = min;
				tp_inst._defaults.minDateTime = min;
			} else {
				if (max) {
					if (max === 0) {
						max = new Date();
					} else {
						max = new Date(max);
					}
					tp_inst._defaults.maxDate = max;
					tp_inst._defaults.maxDateTime = max;
				} else {
					if (onselect) {
						tp_inst._defaults.onSelect = onselect;
					}
				}
			}
		}
		if (value === undefined) {
			return this._base_optionDatepicker(target, name);
		}
		return this._base_optionDatepicker(target, name, value);
	};
	function extendRemove(target, props) {
		$.extend(target, props);
		for (var name in props) {
			if (props[name] === null || props[name] === undefined) {
				target[name] = props[name];
			}
		}
		return target;
	}
	var splitDateTime = function (dateFormat, dateTimeString, dateSettings) {
		try {
			var date = $.datepicker._base_parseDate(
				dateFormat,
				dateTimeString,
				dateSettings,
			);
		} catch (err) {
			if (err.indexOf(":") >= 0) {
				var dateStringLength =
					dateTimeString.length - (err.length - err.indexOf(":") - 2);
				var timeString = dateTimeString.substring(dateStringLength);
				return [
					dateTimeString.substring(0, dateStringLength),
					dateTimeString.substring(dateStringLength),
				];
			} else {
				throw err;
			}
		}
		return [dateTimeString, ""];
	};
	var parseDateTimeInternal = function (
		dateFormat,
		timeFormat,
		dateTimeString,
		dateSettings,
		timeSettings,
	) {
		var date;
		var splitRes = splitDateTime(dateFormat, dateTimeString, dateSettings);
		date = $.datepicker._base_parseDate(dateFormat, splitRes[0], dateSettings);
		if (splitRes[1] !== "") {
			var timeString = splitRes[1];
			var separator =
				timeSettings && timeSettings.separator
					? timeSettings.separator
					: $.timepicker._defaults.separator;
			if (timeString.indexOf(separator) !== 0) {
				throw "Missing time separator";
			}
			timeString = timeString.substring(separator.length);
			var parsedTime = $.datepicker.parseTime(
				timeFormat,
				timeString,
				timeSettings,
			);
			if (parsedTime === null) {
				throw "Wrong time format";
			}
			return { date: date, timeObj: parsedTime };
		} else {
			return { date: date };
		}
	};
	var selectLocalTimeZone = function (tp_inst, date) {
		if (tp_inst && tp_inst.timezone_select) {
			tp_inst._defaults.useLocalTimezone = true;
			var now = typeof date !== "undefined" ? date : new Date();
			var tzoffset = timeZoneString(now);
			if (tp_inst._defaults.timezoneIso8601) {
				tzoffset = tzoffset.substring(0, 3) + ":" + tzoffset.substring(3);
			}
			tp_inst.timezone_select.val(tzoffset);
		}
	};
	var timeZoneString = function (date) {
		var off = (date.getTimezoneOffset() * -10100) / 60;
		var timezone = (off >= 0 ? "+" : "-") + Math.abs(off).toString().substr(1);
		return timezone;
	};
	$.timepicker = new Timepicker();
	$.timepicker.version = "1.0.1";
})(jQuery);

/**
 * dependsOn v1.0.1
 * a jQuery plugin to facilitate the handling of form field dependencies.
 *
 * Copyright 2014 David Street
 * Licensed under the MIT license.
 * Changed by Wim Bouter (De Webmakers)
 */

(function (e) {
	var t = function (t, n) {
		this.selector = t;
		this.$dependencyObj = e(t);
		this.qualifiers = n;
	};
	t.prototype.enabled = function (t) {
		if (e(this.selector + "[disabled]").length > 0) {
			if (t) {
				return false;
			}
		} else {
			if (!t) {
				return false;
			}
		}
		return true;
	};
	t.prototype.checked = function (e) {
		if (
			this.$dependencyObj.attr("type") === "checkbox" ||
			this.$dependencyObj.attr("type") === "radio"
		) {
			if (
				(!this.$dependencyObj.is(":checked") && e) ||
				(this.$dependencyObj.is(":checked") && !e)
			) {
				return false;
			}
		}
		return true;
	};
	t.prototype.values = function (t) {
		var n = this.$dependencyObj.val(),
			r = t.length,
			i = 0,
			s = false,
			o = [];
		if (this.$dependencyObj.attr("type") === "radio") {
			n = this.$dependencyObj.filter(":checked").val();
		}
		if (
			(typeof n === "array" || typeof n === "object") &&
			(typeof t === "array" || typeof t === "object")
		) {
			e.grep(t, function (t) {
				if (e.inArray(t, n) == -1) o.push(t);
			});
			if (o.length == 0) s = true;
			return s;
		}
		for (i; i < r; i += 1) {
			if (typeof n === "array" || typeof n === "object") {
				if (
					e(this.$dependencyObj.val()).not(e(t[i])).length === 0 &&
					e(t[i]).not(e(this.$dependencyObj.val())).length === 0
				) {
					s = true;
					break;
				}
			} else {
				if (t[i] === n) {
					s = true;
					break;
				}
			}
		}
		return s;
	};
	t.prototype.not = function (e) {
		var t = this.$dependencyObj.val(),
			n = e.length,
			r = 0;
		for (r; r < n; r += 1) {
			if (e[r] === t) {
				return false;
			}
		}
		return true;
	};
	t.prototype.match = function (e) {
		var t = this.$dependencyObj.val(),
			n = e;
		return t.match(n);
	};
	t.prototype.notmatch = function (e) {
		var t = this.$dependencyObj.val(),
			n = e;
		var r = t.match(n);
		if (r) {
			return false;
		} else {
			return true;
		}
	};
	t.prototype.contains = function (t) {
		var n = this.$dependencyObj.val(),
			r = 0;
		if (typeof n === "array" || typeof n === "object") {
			for (r in t) {
				if (e.inArray(t[r], n) !== -1) {
					return true;
				}
			}
		} else {
			return this.values(t);
		}
		return false;
	};
	t.prototype.doesQualify = function () {
		var e = 0;
		for (e in this.qualifiers) {
			if (
				t.prototype.hasOwnProperty(e) &&
				typeof t.prototype[e] === "function"
			) {
				if (!this[e](this.qualifiers[e])) {
					return false;
				}
			} else {
				if (typeof (this.qualifiers[e] === "function")) {
					return this.qualifiers[e](this.$dependencyObj.val());
				}
			}
		}
		return true;
	};
	var n = function (e) {
		var n = 0;
		this.dependencies = [];
		for (n in e) {
			this.dependencies.push(new t(n, e[n]));
		}
	};
	n.prototype.doesQualify = function () {
		var e = this.dependencies.length,
			t = 0,
			n = true;
		for (t; t < e; t += 1) {
			if (!this.dependencies[t].doesQualify()) {
				n = false;
				break;
			}
		}
		return n;
	};
	var r = function (t, n, r) {
		this.dependencySets = [];
		this.$subject = t;
		this.settings = e.extend(
			{
				disable: true,
				hide: true,
				duration: 200,
				onEnable: function () {},
				onDisable: function () {},
			},
			r,
		);
		this.enableCallback = function () {};
		this.disableCallback = function () {};
		this.init(n);
	};
	r.prototype.init = function (e) {
		this.addSet(e);
		this.check(true);
	};
	r.prototype.addSet = function (e) {
		var t = this,
			r = 0,
			i = 0,
			s = 0,
			o;
		this.dependencySets.push(new n(e));
		r = this.dependencySets.length - 1;
		i = this.dependencySets[r].dependencies.length;
		for (s; s < i; s += 1) {
			o = this.dependencySets[r].dependencies[s];
			o.$dependencyObj.on("change", function (e) {
				t.triggeredEvent = e;
				t.triggeredDependency = this;
				t.check();
			});
			if (o.$dependencyObj.attr("type") === "radio") {
				o.$dependencyObj.on("deselect", function (e) {
					t.triggeredEvent = e;
					t.triggeredDependency = this;
					t.check();
				});
			}
			if (o.$dependencyObj.attr("type") === "text") {
				o.$dependencyObj.on("keypress", function (e) {
					if (e.which && o.$dependencyObj.is(":focus")) {
						if (t.check()) {
							t.triggeredEvent = e;
							t.triggeredDependency = this;
							t.check();
						}
					}
				});
			}
		}
	};
	r.prototype.or = function (e) {
		this.addSet(e);
		this.check(false);
		return this;
	};
	r.prototype.enable = function (t) {
		var n = this.$subject,
			r = this.$subject.attr("id"),
			i;
		if (
			this.settings.hasOwnProperty("valueTarget") &&
			this.settings.valueTarget !== undefined
		) {
			n = e(this.settings.valueTarget);
		} else if (
			this.$subject[0].nodeName.toLowerCase() !== "input" &&
			this.$subject[0].nodeName.toLowerCase() !== "textarea" &&
			this.$subject[0].nodeName.toLowerCase() !== "select"
		) {
			n = this.$subject.find("input, textarea, select");
		}
		this.settings.onEnable.call(
			this.triggeredDependency,
			this.triggeredEvent,
			e(this.triggeredDependency).attr("id"),
		);
	};
	r.prototype.disable = function (t) {
		var n = this.$subject,
			r = this.$subject.attr("id"),
			i;
		if (
			this.settings.hasOwnProperty("valueTarget") &&
			this.settings.valueTarget !== undefined
		) {
			n = e(this.settings.valueTarget);
		} else if (
			this.$subject[0].nodeName.toLowerCase() !== "input" &&
			this.$subject[0].nodeName.toLowerCase() !== "textarea" &&
			this.$subject[0].nodeName.toLowerCase() !== "select"
		) {
			n = this.$subject.find("input, textarea, select");
		}
		this.settings.onDisable.call(
			this.triggeredDependency,
			this.triggeredEvent,
			e(this.triggeredDependency).attr("id"),
		);
	};
	r.prototype.check = function (e) {
		var t = this.dependencySets.length,
			n = 0,
			r = false;
		for (n; n < t; n += 1) {
			if (this.dependencySets[n].doesQualify()) {
				r = true;
				break;
			}
		}
		if (r) {
			this.enable(e);
			return true;
		} else {
			this.disable(e);
			return false;
		}
	};
	e.fn.dependsOn = function (e, t) {
		var n = new r(this, e, t);
		return n;
	};
})(jQuery);

/*

	jQuery Tags Input Plugin 1.3.3
	
	Copyright (c) 2011 XOXCO, Inc
	
	Documentation for this plugin lives here:
	http://xoxco.com/clickable/jquery-tags-input
	
	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php

	ben@xoxco.com

*/
(function (e) {
	var t = new Array();
	var n = new Array();
	e.fn.doAutosize = function (t) {
		var n = e(this).data("minwidth"),
			r = e(this).data("maxwidth"),
			i = "",
			s = e(this),
			o = e("#" + e(this).data("tester_id"));
		if (i === (i = s.val())) {
			return;
		}
		var u = i
			.replace(/&/g, "&")
			.replace(/\s/g, " ")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		o.html(u);
		var a = o.width(),
			f = a + t.comfortZone >= n ? a + t.comfortZone : n,
			l = s.width(),
			c = (f < l && f >= n) || (f > n && f < r);
		if (c) {
			s.width(f);
		}
	};
	e.fn.resetAutosize = function (t) {
		var n = e(this).data("minwidth") || t.minInputWidth || e(this).width(),
			r =
				e(this).data("maxwidth") ||
				t.maxInputWidth ||
				e(this).closest(".tagsinput").width() - t.inputPadding,
			i = "",
			s = e(this),
			o = e("<tester/>").css({
				position: "absolute",
				top: -9999,
				left: -9999,
				width: "auto",
				fontSize: s.css("fontSize"),
				fontFamily: s.css("fontFamily"),
				fontWeight: s.css("fontWeight"),
				letterSpacing: s.css("letterSpacing"),
				whiteSpace: "nowrap",
			}),
			u = e(this).attr("id") + "_autosize_tester";
		if (!e("#" + u).length > 0) {
			o.attr("id", u);
			o.appendTo("body");
		}
		s.data("minwidth", n);
		s.data("maxwidth", r);
		s.data("tester_id", u);
		s.css("width", n);
	};
	e.fn.addTag = function (r, i) {
		i = jQuery.extend({ focus: false, callback: true }, i);
		this.each(function () {
			var s = e(this).attr("id");
			var o = e(this).val().split(t[s]);
			if (o[0] == "") {
				o = new Array();
			}
			r = jQuery.trim(r);
			if (i.unique) {
				var u = e(this).tagExist(r);
				if (u == true) {
					e("#" + s + "_tag").addClass("not_valid");
				}
			} else {
				var u = false;
			}
			if (r != "" && u != true) {
				e("<span>")
					.addClass("tag")
					.append(
						e("<span>").text(r).append("&nbsp;&nbsp;"),
						e("<a>", {
							href: "#",
							title: ccm_t_ff("Removing tag"),
							text: "x",
						}).click(function () {
							return e("#" + s).removeTag(escape(r));
						}),
					)
					.insertBefore("#" + s + "_addTag");
				o.push(r);
				e("#" + s + "_tag").val("");
				if (i.focus) {
					e("#" + s + "_tag").focus();
				} else {
					e("#" + s + "_tag").blur();
				}
				e.fn.tagsInput.updateTagsField(this, o);
				if (i.callback && n[s] && n[s]["onAddTag"]) {
					var a = n[s]["onAddTag"];
					a.call(this, r);
				}
				if (n[s] && n[s]["onChange"]) {
					var f = o.length;
					var a = n[s]["onChange"];
					a.call(this, e(this), o[f - 1]);
				}
			}
		});
		return false;
	};
	e.fn.removeTag = function (r) {
		r = unescape(r);
		this.each(function () {
			var s = e(this).attr("id");
			var o = e(this).val().split(t[s]);
			e("#" + s + "_tagsinput .tag").remove();
			str = "";
			for (i = 0; i < o.length; i++) {
				if (o[i] != r) {
					str = str + t[s] + o[i];
				}
			}
			e.fn.tagsInput.importTags(this, str);
			if (n[s] && n[s]["onRemoveTag"]) {
				var u = n[s]["onRemoveTag"];
				u.call(this, r);
			}
		});
		return false;
	};
	e.fn.tagExist = function (n) {
		var r = e(this).attr("id");
		var i = e(this).val().split(t[r]);
		return jQuery.inArray(n, i) >= 0;
	};
	e.fn.importTags = function (t) {
		id = e(this).attr("id");
		e("#" + id + "_tagsinput .tag").remove();
		e.fn.tagsInput.importTags(this, t);
	};
	e.fn.tagsInput = function (r) {
		var i = jQuery.extend(
			{
				interactive: true,
				defaultText: "add a tag",
				minChars: 0,
				width: "300px",
				height: "100px",
				autocomplete: { selectFirst: false },
				hide: true,
				delimiter: ",",
				unique: true,
				removeWithBackspace: true,
				placeholderColor: "#666666",
				autosize: true,
				comfortZone: 20,
				inputPadding: 6 * 2,
			},
			r,
		);
		this.each(function () {
			if (i.hide) {
				e(this).hide();
			}
			var r = e(this).attr("id");
			if (!r || t[e(this).attr("id")]) {
				r = e(this)
					.attr("id", "tags" + new Date().getTime())
					.attr("id");
			}
			var s = jQuery.extend(
				{
					pid: r,
					real_input: "#" + r,
					holder: "#" + r + "_tagsinput",
					input_wrapper: "#" + r + "_addTag",
					fake_input: "#" + r + "_tag",
				},
				i,
			);
			t[r] = s.delimiter;
			if (i.onAddTag || i.onRemoveTag || i.onChange) {
				n[r] = new Array();
				n[r]["onAddTag"] = i.onAddTag;
				n[r]["onRemoveTag"] = i.onRemoveTag;
				n[r]["onChange"] = i.onChange;
			}
			var o =
				'<div id="' +
				r +
				'_tagsinput" class="tagsinput"><div id="' +
				r +
				'_addTag">';
			if (i.interactive) {
				o =
					o +
					'<input id="' +
					r +
					'_tag" value="" data-default="' +
					i.defaultText +
					'" />';
			}
			o = o + '</div><div class="tags_clear"></div></div>';
			e(o).insertAfter(this);
			e(s.holder).css("width", i.width);
			e(s.holder).css("min-height", i.height);
			e(s.holder).css("height", "100%");
			if (e(s.real_input).val() != "") {
				e.fn.tagsInput.importTags(e(s.real_input), e(s.real_input).val());
			}
			if (i.interactive) {
				e(s.fake_input).val(e(s.fake_input).attr("data-default"));
				e(s.fake_input).css("color", i.placeholderColor);
				e(s.fake_input).resetAutosize(i);
				e(s.holder).bind("click", s, function (t) {
					e(t.data.fake_input).focus();
				});
				e(s.fake_input).bind("focus", s, function (t) {
					if (
						e(t.data.fake_input).val() ==
						e(t.data.fake_input).attr("data-default")
					) {
						e(t.data.fake_input).val("");
					}
					e(t.data.fake_input).css("color", "#000000");
				});
				if (i.autocomplete_url != undefined) {
					autocomplete_options = { source: i.autocomplete_url };
					for (attrname in i.autocomplete) {
						autocomplete_options[attrname] = i.autocomplete[attrname];
					}
					if (jQuery.Autocompleter !== undefined) {
						e(s.fake_input).autocomplete(i.autocomplete_url, i.autocomplete);
						e(s.fake_input).bind("result", s, function (t, n, s) {
							if (n) {
								e("#" + r).addTag(n[0] + "", { focus: true, unique: i.unique });
							}
						});
					} else if (jQuery.ui.autocomplete !== undefined) {
						e(s.fake_input).autocomplete(autocomplete_options);
						e(s.fake_input).bind("autocompleteselect", s, function (t, n) {
							e(t.data.real_input).addTag(n.item.value, {
								focus: true,
								unique: i.unique,
							});
							return false;
						});
					}
				} else {
					e(s.fake_input).bind("blur", s, function (t) {
						var n = e(this).attr("data-default");
						if (
							e(t.data.fake_input).val() != "" &&
							e(t.data.fake_input).val() != n
						) {
							if (
								t.data.minChars <= e(t.data.fake_input).val().length &&
								(!t.data.maxChars ||
									t.data.maxChars >= e(t.data.fake_input).val().length)
							)
								e(t.data.real_input).addTag(e(t.data.fake_input).val(), {
									focus: true,
									unique: i.unique,
								});
						} else {
							e(t.data.fake_input).val(
								e(t.data.fake_input).attr("data-default"),
							);
							e(t.data.fake_input).css("color", i.placeholderColor);
						}
						return false;
					});
				}
				e(s.fake_input).bind("keypress", s, function (t) {
					if (t.which == t.data.delimiter.charCodeAt(0) || t.which == 13) {
						t.preventDefault();
						if (
							t.data.minChars <= e(t.data.fake_input).val().length &&
							(!t.data.maxChars ||
								t.data.maxChars >= e(t.data.fake_input).val().length)
						)
							e(t.data.real_input).addTag(e(t.data.fake_input).val(), {
								focus: true,
								unique: i.unique,
							});
						e(t.data.fake_input).resetAutosize(i);
						return false;
					} else if (t.data.autosize) {
						e(t.data.fake_input).doAutosize(i);
					}
				});
				s.removeWithBackspace &&
					e(s.fake_input).bind("keydown", function (t) {
						if (t.keyCode == 8 && e(this).val() == "") {
							t.preventDefault();
							var n = e(this).closest(".tagsinput").find(".tag:last").text();
							var r = e(this).attr("id").replace(/_tag$/, "");
							n = n.replace(/[\s]+x$/, "");
							e("#" + r).removeTag(escape(n));
							e(this).trigger("focus");
						}
					});
				e(s.fake_input).blur();
				if (s.unique) {
					e(s.fake_input).keydown(function (t) {
						if (
							t.keyCode == 8 ||
							String.fromCharCode(t.which).match(
								/\w+|[Ã¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ"ÃšÃ±Ã',/]+/,
							)
						) {
							e(this).removeClass("not_valid");
						}
					});
				}
			}
		});
		return this;
	};
	e.fn.tagsInput.updateTagsField = function (n, r) {
		var i = e(n).attr("id");
		e(n).val(r.join(t[i]));
	};
	e.fn.tagsInput.importTags = function (r, s) {
		e(r).val("");
		var o = e(r).attr("id");
		var u = s.split(t[o]);
		for (i = 0; i < u.length; i++) {
			e(r).addTag(u[i], { focus: false, callback: false });
		}
		if (n[o] && n[o]["onChange"]) {
			var a = n[o]["onChange"];
			a.call(r, r, u[i]);
		}
	};
})(jQuery);

/*
 * jQuery UI Password Strength @VERSION
 *
 * Copyright (c) 2008 Tane Piper
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.progressbar.js
 */
(function ($) {
	$.widget("ui.pwstrength", {
		options: {
			minChar: 0,
			progressClass: ["0", "25", "50", "75", "100"],
			scores: [17, 26, 40, 50],
			verdicts: ["Weak", "Normal", "Medium", "Strong", "Very Strong"],
			showVerdicts: true,
			raisePower: 1.4,
			usernameField: "",
			onLoad: undefined,
			onKeyUp: undefined,
		},
		_create: function () {
			var self = this,
				options = this.options;
			var id = new Date().getTime() + Math.random();
			this.element
				.addClass("ui-password")
				.attr({ role: "password" })
				.bind("keyup.pwstrength", function (event) {
					$.ui.pwstrength.errors = [];
					self._calculateScore(self.element.val());
					if ($.isFunction(options.onKeyUp)) options.onKeyUp();
				});
			$.extend(this, { identifier: id, wordToShort: true });
			$(this._progressWidget()).insertAfter(this.element);
			$(".ui-password-meter").progressbar({ value: 0 });
			if (options.showVerdicts)
				$(".ui-password-meter")
					.children()
					.html(
						'<span class="password-verdict">' + options.verdicts[0] + "</span>",
					);
			if ($.isFunction(options.onLoad)) options.onLoad();
		},
		destroy: function () {
			this.element.removeClass(".ui-password").removeAttr("role");
			$.Widget.prototype.destroy.call(this);
		},
		_calculateScore: function (word) {
			var self = this;
			var totalScore = 0;
			$.each($.ui.pwstrength.rules, function (rule, active) {
				if (active === true) {
					var score = $.ui.pwstrength.ruleScores[rule];
					var result = $.ui.pwstrength.validationRules[rule](self, word, score);
					if (result) {
						totalScore += result;
					}
				}
			});
			this._setProgressBar(totalScore);
			return totalScore;
		},
		_setProgressBar: function (score) {
			var self = this;
			var options = this.options;
			var progress_width = 0;
			$(".ui-progressbar-value", ".ui-password-meter")[
				score >= options.scores[0] && score < options.scores[1]
					? "addClass"
					: "removeClass"
			]("password-" + options.progressClass[1]);
			$(".ui-progressbar-value", ".ui-password-meter")[
				score >= options.scores[1] && score < options.scores[2]
					? "addClass"
					: "removeClass"
			]("password-" + options.progressClass[2]);
			$(".ui-progressbar-value", ".ui-password-meter")[
				score >= options.scores[2] && score < options.scores[3]
					? "addClass"
					: "removeClass"
			]("password-" + options.progressClass[3]);
			$(".ui-progressbar-value", ".ui-password-meter")[
				score >= options.scores[3] ? "addClass" : "removeClass"
			]("password-" + options.progressClass[4]);
			if (score < options.scores[0]) {
				progress_width = 5;
				$(".ui-password-meter").progressbar("value", progress_width);
				if (options.showVerdicts)
					$(".ui-password-meter")
						.children()
						.html(
							'<span class="password-verdict">' +
								options.verdicts[0] +
								"</span>",
						);
			} else if (score >= options.scores[0] && score < options.scores[1]) {
				progress_width = 25;
				$(".ui-password-meter").progressbar("value", progress_width);
				if (options.showVerdicts)
					$(".ui-password-meter")
						.children()
						.html(
							'<span class="password-verdict">' +
								options.verdicts[1] +
								"</span>",
						);
			} else if (score >= options.scores[1] && score < options.scores[2]) {
				progress_width = 50;
				$(".ui-password-meter").progressbar("value", progress_width);
				if (options.showVerdicts)
					$(".ui-password-meter")
						.children()
						.html(
							'<span class="password-verdict">' +
								options.verdicts[2] +
								"</span>",
						);
			} else if (score >= options.scores[2] && score < options.scores[3]) {
				progress_width = 75;
				$(".ui-password-meter").progressbar("value", progress_width);
				if (options.showVerdicts)
					$(".ui-password-meter")
						.children()
						.html(
							'<span class="password-verdict">' +
								options.verdicts[3] +
								"</span>",
						);
			} else if (score >= options.scores[3]) {
				progress_width = 100;
				$(".ui-password-meter").progressbar("value", progress_width);
				if (options.showVerdicts)
					$(".ui-password-meter")
						.children()
						.html(
							'<span class="password-verdict">' +
								options.verdicts[4] +
								"</span>",
						);
			}
		},
		_progressWidget: function () {
			return '<div class="ui-password-meter></div>';
		},
	});
	$.extend($.ui.pwstrength, {
		errors: [],
		outputErrorList: function () {
			var output = "<ul>";
			$.each($.ui.pwstrength.errors, function (i, item) {
				output += "<li>" + item + "</li>";
			});
			output += "</ul>";
			return output;
		},
		addRule: function (name, method, score, active) {
			$.ui.pwstrength.rules[name] = active;
			$.ui.pwstrength.ruleScores[name] = score;
			$.ui.pwstrength.validationRules[name] = method;
		},
		changeScore: function (rule, score) {
			$.ui.pwstrength.ruleScores[rule] = score;
		},
		ruleActive: function (rule, active) {
			$.ui.pwstrength.rules[rule] = active;
		},
		ruleScores: {
			wordNotEmail: -100,
			wordLength: -100,
			wordSimilarToUsername: -100,
			wordLowercase: 1,
			wordUppercase: 3,
			wordOneNumber: 3,
			wordThreeNumbers: 5,
			wordOneSpecialChar: 3,
			wordTwoSpecialChar: 5,
			wordUpperLowerCombo: 2,
			wordLetterNumberCombo: 2,
			wordLetterNumberCharCombo: 2,
		},
		rules: {
			wordNotEmail: true,
			wordLength: true,
			wordSimilarToUsername: true,
			wordLowercase: true,
			wordUppercase: true,
			wordOneNumber: true,
			wordThreeNumbers: true,
			wordOneSpecialChar: true,
			wordTwoSpecialChar: true,
			wordUpperLowerCombo: true,
			wordLetterNumberCombo: true,
			wordLetterNumberCharCombo: true,
		},
		validationRules: {
			wordNotEmail: function (ui, word, score) {
				return (
					word.match(
						/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i,
					) && score
				);
			},
			wordLength: function (ui, word, score) {
				var options = ui.options;
				var wordlen = word.length;
				var lenScore = Math.pow(wordlen, options.raisePower);
				ui.wordToShort = false;
				if (wordlen < options.minChar) {
					lenScore = lenScore + score;
					ui.wordToShort = true;
					$.ui.pwstrength.errors.push(options.errorMessages.password_to_short);
				}
				return lenScore;
			},
			wordSimilarToUsername: function (ui, word, score) {
				var options = ui.options;
				var username = $(options.usernameField).val();
				if (username && word.toLowerCase().match(username.toLowerCase())) {
					$.ui.pwstrength.errors.push(options.errorMessages.same_as_username);
					return score;
				}
				return true;
			},
			wordLowercase: function (ui, word, score) {
				return word.match(/[a-z]/) && score;
			},
			wordUppercase: function (ui, word, score) {
				return word.match(/[A-Z]/) && score;
			},
			wordOneNumber: function (ui, word, score) {
				return word.match(/\d+/) && score;
			},
			wordThreeNumbers: function (ui, word, score) {
				return word.match(/(.*[0-9].*[0-9].*[0-9])/) && score;
			},
			wordOneSpecialChar: function (ui, word, score) {
				return word.match(/.[!,@,#,$,%,\^,&,*,?,_,~]/) && score;
			},
			wordTwoSpecialChar: function (ui, word, score) {
				return (
					word.match(
						/(.*[!,@,#,$,%,\^,&,*,?,_,~].*[!,@,#,$,%,\^,&,*,?,_,~])/,
					) && score
				);
			},
			wordUpperLowerCombo: function (ui, word, score) {
				return word.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && score;
			},
			wordLetterNumberCombo: function (ui, word, score) {
				return word.match(/([a-zA-Z])/) && word.match(/([0-9])/) && score;
			},
			wordLetterNumberCharCombo: function (ui, word, score) {
				return (
					word.match(
						/([a-zA-Z0-9].*[!,@,#,$,%,\^,&,*,?,_,~])|([!,@,#,$,%,\^,&,*,?,_,~].*[a-zA-Z0-9])/,
					) && score
				);
			},
		},
	});
})(jQuery);
