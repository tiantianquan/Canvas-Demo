var canvas = document.getElementById('c');
gl = initWebGL(canvas)

function initWebGL(canvas) {
  gl = null;

  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  } catch (e) {}

  // If we don't have a GL context, give up now
  if (!gl) {
    console.log("Unable to initialize WebGL. Your browser may not support it.");
    gl = null;
  }

  return gl;
}

//--------------

var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
var vertices = [-0.5, -0.5, 0.5, -0.5, 0, 0.5];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.STATIC_DRAW);

//setup for the vertex shader and fragment shader
var vs = 'attribute vec2 pos;' +
'void main(){ gl_Position = vec4(pos,0,1);}';
var fs = 'precision mediump float;' +
'void main(){ gl_FragColor = vec4(0,0.8,0,1);}';


function createShader(str, type){
  var shader = gl.createShader(type);
  gl.shaderSource(shader,str);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }
  return shader;
}
function createProgram(vstr,fstr){
  var program = gl.createProgram();
  var vshader = createShader(vstr,gl.VERTEX_SHADER);
  var fshader = createShader(fstr, gl.FRAGMENT_SHADER);
  gl.attachShader(program,vshader);
  gl.attachShader(program,fshader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }
  return program;
}
//创建shader program
var program = createProgram(vs,fs);
gl.useProgram(program);

program.vertexPosAttrib = gl.getAttribLocation(program,'pos');
gl.enableVertexAttribArray(program.vertexPosAttrib);
gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);


gl.drawArrays(gl.TRIANGLES,0,3);