let brandList = null;
let selectedBrand = null;

const BrandService = (function () {

    var setBrandList = function (brands) {
        brandList = brands;
        localStorage.setItem('userBrandList', JSON.stringify(brands));
    };

    var getBrandList = function () {
        if (brandList == null) { //Load from local storage
            brandList = JSON.parse(localStorage.getItem('userBrandList'));
        }
        return brandList;
    };

    var setBrand = function (brandId) {
        selectedBrand = brandList.find(function (element) {
            return parseInt(element.id) === parseInt(brandId);
        });
    };

    var getBrand = function () {
        return selectedBrand;
    };

    return {
        setBrandList: setBrandList,
        getBrandList: getBrandList,
        setBrand: setBrand,
        getBrand: getBrand
    }

})();

export default BrandService;