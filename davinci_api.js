//Load cl (Current Lesson)
/**
 * cl
*/
var cl = (function () {
	$.ajax({
		url:lessonURL,
		async:false,
		dataType: 'json',
		success: function (data) {
			cl = data;									
		},
		error: function (xhr, textStatus, errorThrown) {
			console.log("Error: " + textStatus + " | " + errorThrown + " | " + xhr);			
			return "Unloaded";
		}
	});
	return cl.lesson;
})();

//Init Globals
var totalPages = 0;
var currPage = 0;
var currStep = 0;

//Create davinci
var davinci = {
	init: function(){
		$("#lessonTitle").html(cl.lessonTitle);	
		$("#lessonSummary").html(cl.lessonSummary);			
		$(cl.pages).each(function(){
			$("#lessonNav").append('<div id="'+this.pageId+'_nav" class="navOptions" onclick="davinci.showPage('+ totalPages++ +');">'+this.pageTitle+"</div>");			
		});	
		this.showPage(currPage);	
	},
	showPage: function(pageNum) {
		currPage = pageNum;
		cp = cl.pages[pageNum];
		$("#pageTitle").html(cp.pageTitle);	
		$("#pageSummary").html(cp.pageSummary);
		currStep = 0; //On a new page, so default to first step.
		this.showStep(currStep);
	},
	goPage: function(p) {
		if(p === "undefined") {p = 1;} //If p isn't set, assume we're moving forward.
		currPage += p;	
		if (currPage < 0) { //Gone back too far, reset to zero;
			currPage = 0;
			this.showPage(currPage);
		} else if (currPage < totalPages) { //Normal page advancement
			this.showPage(currPage);
		} else { //End of lesson. Todo: Add logic to advance to next lesson (or end).		
			currPage = 0;
			this.showPage(currPage);		
		}
	},
	goStep: function(s) {		
		currStep += s;
		if (currStep < 0) {
			currStep = 0;
			this.goPage(-1);
		} else if (currStep < cl.pages[currPage].pageMedia.length) {
			this.showStep(currStep);
		} else {
			//currStep is too large, advance to the next page.
			this.goPage(1);
		}
	},
	showStep: function(s) {
		cs = cl.pages[currPage].pageMedia[s];
		$("#stepTitle").html(cs.title);
		ccText = $.ajax({url: media + cs.cc, async: false}).responseText;
		$("#slideshowContainer").html('<img id="slideshowImage" src="'+media+cs.image+'"/>').show();
		$("#stepCC").html(ccText);
		this.setAudio(media+cs.audio);
	},
	setAudio: function(mediaFile) {
		$("#mainAudio").trigger('stop'); //Stop it if it's already playing.
		$("#mainAudio").html('<source src="'+mediaFile+'.ogg" type="audio/ogg"/><source src="'+mediaFile+'.mp3" type="audio/mpeg"/>');
		$("#mainAudio").trigger('load');
		$("#mainAudio").trigger('play');
	}	
};

$("document").ready(function () {	
	davinci.init();
});	

