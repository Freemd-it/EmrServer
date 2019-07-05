import $ from 'jquery';
import 'jquery-validation';
import _ from 'lodash';

function updatePrescriptionTable(data, status) {

    if ($('#prescription-table-body .defaultPrescriptionTableBody').length) {
        $('#prescription-table-body .defaultPrescriptionTableBody').remove();
    }

    let icon = '';
    switch (status) {
        case '2':
            icon = `<td class="deletePrescriptionTD"><i class="sign out icon delete-icon-size deleteTargetByIcon"></i></td>`;
        default:
            icon = `<td class="deletePrescriptionTD"><i class="sign out icon delete-icon-size deleteTargetByIcon"></i></td>`;
    }
    data.prescriptions.forEach(prescription => {
        const { medicine_id, medicineName, medicineIngredient } = prescription;
        $('#prescription-table-body').append(
            `<tr id=${medicine_id}>
                <td>${medicineName}</td>
                <td>${medicineIngredient}</td>
                <td><input name="currentDoses"/></td>
                <td width="10%">
                    <select class="doses-for-day">
                        <option selected value="qd">qd</option>
                        <option value="bid">bid</option>
                        <option value="tid">tid</option>
                        <option value="qid">qid</option>
                        <option value="hs">hs</option>
                    </select>
                </td>
                <td><input name="currentDosesDay"/></td>
                <td><input name="currentRemarks"/></td>
                ${icon}
            </tr>`
        )
    });

    $('.doses-for-day').addClass('ui search fluid dropdown');
    $('.doses-for-day.dropdown').dropdown();

}


module.exports = {
    updatePrescriptionTable
}