// For more info visit here!
// https://home.openweathermap.org/api_keys

const API_KEY = "544322076d8c9d87da28f0b95214e2eb";

const weatherByCity = (cityName = "vadodara") => {
    new Promise(function (resolve, reject) {
        cityName = cityName.toLowerCase();

        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
                if (req.status === 200) {
                    resolve(req.responseText);
                } else {
                    reject(Error({ message: "error" }));
                }
            }
        };

        req.open(
            "GET",
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`,
            true
        );
        req.send();
    }).then(
        result => {
            populateData(result);
        },
        err => {
            notification({
                message: `Cannot find city :  ${cityName}`,
                status: "error"
            });
        }
    );
};
