/**
 * Sample Model
 * Matching strict schema specifications
 */

class Sample {
    constructor(hospitalId, hospitalName, data) {
        this.hospitalId = `users/${hospitalId}`; // Reference format
        this.hospitalName = hospitalName;
        this.cancerType = data.cancerType;
        this.tissueType = data.tissueType;
        this.patientAge = Number(data.patientAge);
        this.patientGender = data.patientGender; // Male | Female | Other
        this.preservationMethod = data.preservationMethod; // FFPE | Frozen | Fresh
        this.dateOfCollection = new Date(data.dateOfCollection); // timestamp
        this.quantityAvailable = Number(data.quantityAvailable);
        this.ethicalClearance = Boolean(data.ethicalClearance);
        this.availabilityStatus = data.availabilityStatus || 'Available'; // Available | Reserved | Dispatched
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    toJSON() {
        return {
            hospitalId: this.hospitalId,
            hospitalName: this.hospitalName,
            cancerType: this.cancerType,
            tissueType: this.tissueType,
            patientAge: this.patientAge,
            patientGender: this.patientGender,
            preservationMethod: this.preservationMethod,
            dateOfCollection: this.dateOfCollection,
            quantityAvailable: this.quantityAvailable,
            ethicalClearance: this.ethicalClearance,
            availabilityStatus: this.availabilityStatus,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = { Sample };
