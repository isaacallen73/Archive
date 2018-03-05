import firebase from 'firebase'

    var config = {
        apiKey: "AIzaSyCuStMpf__lrMHc_IxKfTc_NPcbNKgOUbo",
        authDomain: "allen-archive.firebaseapp.com",
        databaseURL: "https://allen-archive.firebaseio.com",
        projectId: "allen-archive",
        storageBucket: "allen-archive.appspot.com",
        messagingSenderId: "993905900622"
    };
    var fire = firebase.initializeApp(config)
    var database = fire.database()

export default database;