function _getRandom(min, max){ return Math.floor((Math.random()*(max-min+1))+min); }
var sight_words = [
	"all",
	"and",
	"are",
	"can",
	"do",
	"for",
	"go",
	"has",
	"have",
	"he",
	"his",
	"I",
	"is",
	"it",
	"me",
	"my",
	"not",
	"of",
	"or",
	"said",
	"see",
	"she",
	"so",
	"the",
	"this",
	"to",
	"was",
	"we",
	"will",
	"you"
];

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}

window.onload = init;
var context;
var bufferLoader;
var myBufferList;

function init() {
	try{
	  // Fix up prefixing
	  window.AudioContext = window.AudioContext || window.webkitAudioContext;
	  context = new AudioContext();

	  bufferLoader = new BufferLoader(
	    context,
	    [
	      'audio/all.m4a',
	      'audio/and.m4a',
	      'audio/are.m4a',
	      'audio/can.m4a',
	      'audio/do.m4a',
	      'audio/for.m4a',
	      'audio/go.m4a',
	      'audio/has.m4a',
	      'audio/have.m4a',
	      'audio/he.m4a',
	      'audio/his.m4a',
	      'audio/i.m4a',
	      'audio/is.m4a',
	      'audio/it.m4a',
	      'audio/me.m4a',
	      'audio/my.m4a',
	      'audio/not.m4a',
	      'audio/of.m4a',
	      'audio/or.m4a',
	      'audio/said.m4a',
	      'audio/see.m4a',
	      'audio/she.m4a',
	      'audio/so.m4a',
	      'audio/the.m4a',
	      'audio/this.m4a',
	      'audio/to.m4a',
	      'audio/was.m4a',
	      'audio/we.m4a',
	      'audio/will.m4a',
	      'audio/you.m4a'
	    ],
	    finishedLoading
	    );

	  bufferLoader.load();
	}
	catch(e){
		//error was thrown loading audio, add no-audio class to disable the bubble
		document.getElementsByTagName('html')[0].className="no-audio";
	}
}



function finishedLoading(bufferList) {
	myBufferList = bufferList;
}