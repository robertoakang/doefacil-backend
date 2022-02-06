const axios = require('axios');

class GoogleMapService {
    constructor() {
        this.baseURL = process.env.GOOGLE_API;
        this.apiKey = process.env.GOOGLE_API_KEY;
    }

    removeAccents(string) {
        return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    async getLocationByAddress(address) {
        address = this.removeAccents(address);
        const url = `${this.baseURL}/place/findplacefromtext/json?inputtype=textquery&&input=${address}&fields=formatted_address,name,geometry&key=${this.apiKey}`;
        const response = await axios.get(url);
        return response.data;
    }

    async getStateByLatLong(coordinates) {
        const url = `${this.baseURL}/geocode/json?latlng=${coordinates}& language = pt&key=${this.apiKey}`;
        const response = await axios.get(url);
        return response.data;
    }

    async getDistanceMatrix(originCoordinates, destinationCoordinates) {
        const url = `${this.baseURL}/distancematrix/json?origins=${originCoordinates}&destinations=${destinationCoordinates}&key=${this.apiKey}`;
        const response = await axios.get(url);
        return response.data;
    }
}

module.exports = new GoogleMapService();
