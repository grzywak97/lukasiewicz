
//inicjowanie zmiennych
const express = require('express')
const bodyParser = require('body-parser')

const readXlsxFile = require('read-excel-file/node')

const port = process.env.PORT || 3000

const app = express()
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true}))

const busboy = require('connect-busboy') //middleware for from /file upload
const path = require('path') //used for file path
const fs = require('fs-extra') //file system handler

app.use(busboy())
app.use(express.static(path.join(__dirname,'public')))


//var a = 5;

// Odwołanie się do katalogu public, aby pobierało pliki css
app.use(express.static(__dirname + '/public'))

//przekierowanie i renderowanie głównego widoku
app.get('/', (request,response) => {
    response.redirect('/index')
})
app.get('/index', (request,response) => {
    response.render('index')
})

//pobranie danych z formularza i wypisanie w konsoli
app.post('/upload',async function(req,res,next){

    var array = []
    var p = ["Bronowicka 71, Kraków","Armii Krajowej 22, Kraków","aleja Kijowska 51, Kraków","Rakowicka 43, Kraków"]
    var fstream
    req.pipe(req.busboy)
    req.busboy.on('file', function(fieldname,file,filename){
        console.log("Uploading: " + filename)

        fstream = fs.createWriteStream(__dirname+'/uploads/'+filename)
        file.pipe(fstream)
        fstream.on('close', function(){
            console.log("Upload Finished of "+ filename)
            
            //tu bezie odczyt z excela
            readXlsxFile(__dirname+'/uploads/trasy.xlsx').then((rows) => {
               // function readData(array){
                    for(var i=0;i<rows.length; i++){
                        array.push(rows[i][0])
                        //array[array.length] = rows[i][0]
                    }
                        console.log(array)
                        res.render('index', { punkty: array })
                       // return array
                        //console.log(array)

                //}
            })
            //console.log(p)
            
            //readData(array)
           // res.render('index', { punkty: p })
        })

    })
})

//console.log(a)


//nasłuchiwanie serwera z callbackiem
app.listen(port,function() {
    console.log('My server is running on port 3000')
})

