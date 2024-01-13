const router = require("express").Router();
const CompanyController = require("../controllers/company.controller");
const validation = require("../middlewares/validation");
const CompanyValidation = require("../validations/company.validation");
const Token = require("../middlewares/verifyToken");



router  // /api/v1/company
    .route("/")
    .get(Token.verifyToken,CompanyController.getAllCompanies)
    .post(Token.authAdmin(['gm' , 'ad']),validation(CompanyValidation.addCompany),CompanyController.addCompany)


 // /api/v1/company/updatePrograms/:id
 router.put('/updatePrograms/:id',Token.authAdmin(['gm' , 'ad']),validation(CompanyValidation.updateProgram)
                                                                                        ,CompanyController.updateProgram)

 // /api/v1/company/updatedRepresentative/:id
router.put('/updatedRepresentative/:id',Token.authAdmin(['gm' , 'ad']),validation(CompanyValidation.updatedRepresentative)
                                                                                    ,CompanyController.updatedRepresentative)



router  // /api/v1/update/:id
   .route("/:id")
   .get(Token.verifyToken,CompanyController.getCompanyById)
   .put(Token.authAdmin(['gm' , 'ad']),validation(CompanyValidation.updateCompany),CompanyController.updateCompany)




module.exports = router;
