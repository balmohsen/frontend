// frontend/src/components/CertificationForm.js

import React, { useState, useEffect } from 'react';
import styles from './CertificationForm.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CertificationForm = () => {
    // Initialize useNavigate
    const navigate = useNavigate();

    // State for form fields
    const [formData, setFormData] = useState({
        manager: '',
        vendorName: '',
        contractName: '',
        contractPeriod: '',
        contractNumber: '',
        consultant: '',
        invoiceNumber: '',
        invoicePeriodFrom: '',
        invoicePeriodTo: '',
        claimAmountNumber: '',
        claimAmountText: '',
        invoiceDetails: '',
        taxNumber: '',
        pages: '',
        departmentName: '',
        adminSignature: '',
        projectManager: '',
        vpName: '',
        ssvpName: 'عبدالقادر بن حمدان المعين',
        // Detailed Breakdown
        description1: '',
        quantityRequested1: '',
        quantitySupplied1: '',
        totalBeforeVAT1: '',
        totalAfterVAT1: '',
        description2: '',
        quantityRequested2: '',
        quantitySupplied2: '',
        totalBeforeVAT2: '',
        totalAfterVAT2: '',
        description3: '',
        quantityRequested3: '',
        quantitySupplied3: '',
        totalBeforeVAT3: '',
        totalAfterVAT3: '',
        description4: '',
        quantityRequested4: '',
        quantitySupplied4: '',
        totalBeforeVAT4: '',
        totalAfterVAT4: '',
        totalExclVAT: '',
        discount: '0',
        totalVAT: '',
        totalInclVAT: '',
        // Payment Summary (Assuming these are still needed)
        contractDuration: '',
        contractValue: '',
        paymentClaim1: '',
        advanceDeduction1: '0',
        penalty1: '0',
        paidUntil1: '',
        remaining1: '',
        percentage1: '',
        paymentClaim2: '',
        advanceDeduction2: '0',
        penalty2: '0',
        paidUntil2: '',
        remaining2: '',
        percentage2: '',
        paymentClaim3: '',
        advanceDeduction3: '0',
        penalty3: '0',
        paidUntil3: '',
        remaining3: '',
        percentage3: '',
        paymentClaim4: '',
        advanceDeduction4: '0',
        penalty4: '0',
        paidUntil4: '',
        remaining4: '',
        percentage4: '',
        totalClaim: '',
        totalAdvanceDeduction: '',
        totalPenalty: '',
        totalPaid: '',
        totalRemaining: '',
        totalPercentage: '',
        // Signatures
        projectManagerSignature: '',
        vpSignature: '',
        ssvpSignature: 'عبدالقادر بن حمدان المعين',
        // Files
        projectManagerSignatureFile: null,
        vpSignatureFile: null,
        ssvpSignatureFile: null,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else if (type === 'number') {
            setFormData({
                ...formData,
                [name]: value === '' ? '' : Number(value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Calculate Detailed Breakdown
    useEffect(() => {
        const calculateDetailedBreakdown = () => {
            let totalExcl = 0;
            let vatAmount = 0;
            let inclVAT = 0;

            // Iterate through 4 items
            for (let i = 1; i <= 4; i++) {
                const totalBeforeVAT = parseFloat(formData[`totalBeforeVAT${i}`]) || 0;
                totalExcl += totalBeforeVAT;
            }

            vatAmount = totalExcl * 0.15;
            inclVAT = totalExcl + vatAmount;

            setFormData((prevData) => ({
                ...prevData,
                totalExclVAT: totalExcl.toFixed(2),
                totalVAT: vatAmount.toFixed(2),
                totalInclVAT: inclVAT.toFixed(2),
            }));
        };

        calculateDetailedBreakdown();
    }, [
        formData.totalBeforeVAT1,
        formData.totalBeforeVAT2,
        formData.totalBeforeVAT3,
        formData.totalBeforeVAT4,
        formData.discount, // Include discount in dependencies
    ]);

    // Calculate Payment Summary
    useEffect(() => {
        const calculatePaymentSummary = () => {
            const contractValue = parseFloat(formData.contractValue) || 0;
            let cumulativePaid = 0;
            let totalClaimVal = 0;
            const updatedPayments = {};

            for (let i = 1; i <= 4; i++) {
                const paymentClaim = parseFloat(formData[`paymentClaim${i}`]) || 0;
                totalClaimVal += paymentClaim;
                cumulativePaid += paymentClaim;

                const remaining = contractValue - cumulativePaid;
                const percentage = contractValue ? ((cumulativePaid / contractValue) * 100).toFixed(2) + ' %' : '0 %';

                updatedPayments[`paidUntil${i}`] = cumulativePaid.toFixed(2);
                updatedPayments[`remaining${i}`] = remaining.toFixed(2);
                updatedPayments[`percentage${i}`] = percentage;
            }

            setFormData((prevData) => ({
                ...prevData,
                ...updatedPayments,
                totalClaim: totalClaimVal.toFixed(2),
                totalPaid: cumulativePaid.toFixed(2),
                totalRemaining: (contractValue - cumulativePaid).toFixed(2),
                totalPercentage: contractValue ? ((cumulativePaid / contractValue) * 100).toFixed(2) + ' %' : '0 %',
                // Assuming totalAdvanceDeduction and totalPenalty are calculated elsewhere or remain zero
                totalAdvanceDeduction: '0',
                totalPenalty: '0',
            }));
        };

        calculatePaymentSummary();
    }, [
        formData.paymentClaim1,
        formData.paymentClaim2,
        formData.paymentClaim3,
        formData.paymentClaim4,
        formData.contractValue,
    ]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare form data
        const submissionData = new FormData();

        // 1. Aggregate Descriptions into an Array
        const descriptions = [];
        for (let i = 1; i <= 4; i++) {
            const descriptionObj = {
                description: formData[`description${i}`],
                quantityRequested: formData[`quantityRequested${i}`],
                quantitySupplied: formData[`quantitySupplied${i}`],
                totalBeforeVAT: formData[`totalBeforeVAT${i}`],
                totalAfterVAT: formData[`totalAfterVAT${i}`],
            };
            descriptions.push(descriptionObj);
        }

        // 2. Append All Other Fields Except Descriptions and Files
        for (const key in formData) {
            if (
                key.startsWith('description') ||
                key.startsWith('quantityRequested') ||
                key.startsWith('quantitySupplied') ||
                key.startsWith('totalBeforeVAT') ||
                key.startsWith('totalAfterVAT') ||
                key.endsWith('File')
            ) {
                continue; // Skip these as they are handled separately
            }
            submissionData.append(key, formData[key]);
        }

        // 3. Append the Descriptions Array as a JSON String
        submissionData.append('descriptions', JSON.stringify(descriptions));

        // 4. Append Files Only If They Are Provided
        if (formData.projectManagerSignatureFile) {
            submissionData.append('projectManagerSignatureFile', formData.projectManagerSignatureFile);
        }

        if (formData.vpSignatureFile) {
            submissionData.append('vpSignatureFile', formData.vpSignatureFile);
        }

        if (formData.ssvpSignatureFile) {
            submissionData.append('ssvpSignatureFile', formData.ssvpSignatureFile);
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/certification/submit`,
                submissionData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure token is correctly stored
                        // 'Content-Type': 'multipart/form-data' // Let Axios set this automatically
                    },
                }
            );

            if (response.status === 201) {
                // Redirect to the confirmation page instead of alerting
                navigate('/submission-success');

                // Optionally, reset the form if needed
                setFormData({
                    manager: '',
                    vendorName: '',
                    contractName: '',
                    contractPeriod: '',
                    contractNumber: '',
                    consultant: '',
                    invoiceNumber: '',
                    invoicePeriodFrom: '',
                    invoicePeriodTo: '',
                    claimAmountNumber: '',
                    claimAmountText: '',
                    invoiceDetails: '',
                    taxNumber: '',
                    pages: '',
                    departmentName: '',
                    adminSignature: '',
                    projectManager: '',
                    vpName: '',
                    ssvpName: 'عبدالقادر بن حمدان المعين',
                    // Detailed Breakdown
                    description1: '',
                    quantityRequested1: '',
                    quantitySupplied1: '',
                    totalBeforeVAT1: '',
                    totalAfterVAT1: '',
                    description2: '',
                    quantityRequested2: '',
                    quantitySupplied2: '',
                    totalBeforeVAT2: '',
                    totalAfterVAT2: '',
                    description3: '',
                    quantityRequested3: '',
                    quantitySupplied3: '',
                    totalBeforeVAT3: '',
                    totalAfterVAT3: '',
                    description4: '',
                    quantityRequested4: '',
                    quantitySupplied4: '',
                    totalBeforeVAT4: '',
                    totalAfterVAT4: '',
                    totalExclVAT: '',
                    discount: '0',
                    totalVAT: '',
                    totalInclVAT: '',
                    // Payment Summary
                    contractDuration: '',
                    contractValue: '',
                    paymentClaim1: '',
                    advanceDeduction1: '0',
                    penalty1: '0',
                    paidUntil1: '',
                    remaining1: '',
                    percentage1: '',
                    paymentClaim2: '',
                    advanceDeduction2: '0',
                    penalty2: '0',
                    paidUntil2: '',
                    remaining2: '',
                    percentage2: '',
                    paymentClaim3: '',
                    advanceDeduction3: '0',
                    penalty3: '0',
                    paidUntil3: '',
                    remaining3: '',
                    percentage3: '',
                    paymentClaim4: '',
                    advanceDeduction4: '0',
                    penalty4: '0',
                    paidUntil4: '',
                    remaining4: '',
                    percentage4: '',
                    totalClaim: '',
                    totalAdvanceDeduction: '',
                    totalPenalty: '',
                    totalPaid: '',
                    totalRemaining: '',
                    totalPercentage: '',
                    // Signatures
                    projectManagerSignature: '',
                    vpSignature: '',
                    ssvpSignature: 'عبدالقادر بن حمدان المعين',
                    // Files
                    projectManagerSignatureFile: null,
                    vpSignatureFile: null,
                    ssvpSignatureFile: null,
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error.response); // Log error.response for debugging
            // Display backend error message if available
            alert(error.response?.data?.message || 'An error occurred while submitting the form.');
        }
    };

    return (
        <div className={styles.container}>
            <h2>شهادة مصادقة وإنجاز أعمال</h2>
            <h3>Completion & Certification of Work Done</h3>
            <form id="certificationForm" onSubmit={handleSubmit}>
                
                {/* Section 1: General Information */}
                <div className={styles.section}>
                    <h3>المعلومات العامة / General Information</h3>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="manager">إلى مدير عام الإدارة المالية / To the Financial Department General Manager</label>
                        <input type="text" id="manager" name="manager" value={formData.manager} onChange={handleChange} required />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="vendorName">اسم الشركة/ المؤسسة/ المورد / VENDOR'S NAME & ADDRESS</label>
                        <input type="text" id="vendorName" name="vendorName" value={formData.vendorName} onChange={handleChange} required />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="contractName">اسم العقد / التعميد / CONTRACT NAME</label>
                        <input type="text" id="contractName" name="contractName" value={formData.contractName} onChange={handleChange} required />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="contractPeriod">مدة العقد / التعميد - CONTRACT Period</label>
                        <input type="number" id="contractPeriod" name="contractPeriod" placeholder="مدة بالايام / Duration in days" value={formData.contractPeriod} onChange={handleChange} required />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="contractNumber">رقم العقد بالنظام / Contract Number in System</label>
                        <input type="text" id="contractNumber" name="contractNumber" value={formData.contractNumber} onChange={handleChange} required />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="consultant">اسم الاستشاري والعنوان (إن وجد) / CONSULTANT'S NAME & ADDRESS (if any)</label>
                        <input type="text" id="consultant" name="consultant" value={formData.consultant} onChange={handleChange} />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="invoiceNumber">رقم المطالبة/ الفاتورة (التسجيل) / Claim / Invoice Number</label>
                        <input type="text" id="invoiceNumber" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} required />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="invoicePeriod">فترة المطالبة/الفاتورة / Invoice Period</label>
                        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                            <input type="date" id="invoicePeriodFrom" name="invoicePeriodFrom" value={formData.invoicePeriodFrom} onChange={handleChange} required />
                            <span style={{ alignSelf: 'center' }}>إلى / To</span>
                            <input type="date" id="invoicePeriodTo" name="invoicePeriodTo" value={formData.invoicePeriodTo} onChange={handleChange} required />
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="claimAmount">قيمة المستخلص / المطالبة / الفاتورة (شامل الضريبة) / AMOUNT OF CLAIM / INVOICE (INCLUDING VAT)</label>
                        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                            <input type="number" id="claimAmountNumber" name="claimAmountNumber" placeholder="المبلغ رقماً / Number (SAR)" value={formData.claimAmountNumber} onChange={handleChange} required />
                            <input type="text" id="claimAmountText" name="claimAmountText" placeholder="كتابة / Written (SAR)" value={formData.claimAmountText} onChange={handleChange} required />
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="invoiceDetails">رقم الفاتورة المسلمة للبرنامج / Invoice Details</label>
                        <input type="text" id="invoiceDetails" name="invoiceDetails" value={formData.invoiceDetails} onChange={handleChange} />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="taxNumber">رقم الضريبة المضافة للمورد / VAT Number for Supplier</label>
                        <input type="text" id="taxNumber" name="taxNumber" value={formData.taxNumber} onChange={handleChange} />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="pages">عدد الصفحات (بما فيها هذا الخطاب) / Number of Pages (including this letter)</label>
                        <input type="number" id="pages" name="pages" value={formData.pages} onChange={handleChange} required />
                    </div>
                </div>
                
                {/* Section 2: Certification */}
                <div className={styles.section}>
                    <h3>التصديق / Certification</h3>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="departmentName">اسم القطاع / DEPARTMENT NAME</label>
                        <input type="text" id="departmentName" name="departmentName" value={formData.departmentName} onChange={handleChange} required />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="adminSignature">اسم الإدارة / Administration Name</label>
                        <input type="text" id="adminSignature" name="adminSignature" value={formData.adminSignature} onChange={handleChange} required />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="projectManager">المشرف / المسؤول على العقد / Project Manager</label>
                        <input type="text" id="projectManager" name="projectManager" value={formData.projectManager} onChange={handleChange} required />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="vpName">نائب الرئيس للقطاع / VP Name</label>
                        <input type="text" id="vpName" name="vpName" value={formData.vpName} onChange={handleChange} required />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="ssvpName">نائب الرئيس التنفيذي للخدمات المشتركة / SSVP Name</label>
                        <input type="text" id="ssvpName" name="ssvpName" value={formData.ssvpName} readOnly />
                    </div>
                </div>
                
                {/* Section 3: Detailed Breakdown */}
                <div className={styles.section}>
                    <h3>الكشف التفصيلي / Detailed Breakdown</h3>
                    
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>الرقم / No.</th>
                                <th>البيان / Description</th>
                                <th>الكمية المطلوبة / Quantity Requested</th>
                                <th>الكمية الموردة / Quantity Supplied</th>
                                <th>الإجمالي قبل الضريبة / Total Before VAT (SAR)</th>
                                <th>ضريبة القيمة المضافة % / VAT %</th>
                                <th>الإجمالي بعد الضريبة / Total After VAT (SAR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Dynamic Rows for Descriptions */}
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i}>
                                    <td>{i}</td>
                                    <td>
                                        <input 
                                            type="text" 
                                            name={`description${i}`} 
                                            value={formData[`description${i}`]} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            name={`quantityRequested${i}`} 
                                            className="quantityRequested" 
                                            value={formData[`quantityRequested${i}`]} 
                                            onChange={handleChange} 
                                            required 
                                            min="0"
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            name={`quantitySupplied${i}`} 
                                            className="quantitySupplied" 
                                            value={formData[`quantitySupplied${i}`]} 
                                            onChange={handleChange} 
                                            required 
                                            min="0"
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            name={`totalBeforeVAT${i}`} 
                                            className="totalBeforeVAT" 
                                            value={formData[`totalBeforeVAT${i}`]} 
                                            onChange={handleChange} 
                                            required 
                                            min="0"
                                        />
                                    </td>
                                    <td>15%</td>
                                    <td>
                                        <input 
                                            type="number" 
                                            name={`totalAfterVAT${i}`} 
                                            className="totalAfterVAT" 
                                            value={formData[`totalAfterVAT${i}`]} 
                                            readOnly 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="4">الإجمالي غير شامل ضريبة القيمة المضافة / Total Excluding VAT</td>
                                <td colSpan="2"></td>
                                <td><input type="number" id="totalExclVAT" name="totalExclVAT" value={formData.totalExclVAT} readOnly /></td>
                            </tr>
                            <tr>
                                <td colSpan="4">خصم / Discount</td>
                                <td colSpan="2"></td>
                                <td><input type="number" id="discount" name="discount" value={formData.discount} onChange={handleChange} min="0" /></td>
                            </tr>
                            <tr>
                                <td colSpan="4">ضريبة القيمة المضافة / VAT 15%</td>
                                <td colSpan="2"></td>
                                <td><input type="number" id="totalVAT" name="totalVAT" value={formData.totalVAT} readOnly /></td>
                            </tr>
                            <tr>
                                <td colSpan="4">المجموع شامل ضريبة القيمة المضافة / Total Including VAT</td>
                                <td colSpan="2"></td>
                                <td><input type="number" id="totalInclVAT" name="totalInclVAT" value={formData.totalInclVAT} readOnly /></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                {/* Section 4: Payment Summary */}
                <div className={styles.section}>
                    <h3>مستخلص الدفعة / Payment Summary</h3>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="contractDuration">مدة العقد / Contract Duration</label>
                        <input type="number" id="contractDuration" name="contractDuration" value={formData.contractDuration} onChange={handleChange} required />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="contractValue">قيمة العقد / Contract Value (SAR)</label>
                        <input type="number" id="contractValue" name="contractValue" value={formData.contractValue} onChange={handleChange} required />
                    </div>
                    
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>الرقم / No.</th>
                                <th>قيمة المطالبة / Claim Value (SAR)</th>
                                <th>حسم الدفعة المقدمة / Advance Payment Deduction (SAR)</th>
                                <th>الغرامة / Penalty (SAR)</th>
                                <th>المنصرف حتى هذه الدفعة / Paid Until This Payment (SAR)</th>
                                <th>المتبقي من قيمة العقد / Remaining Contract Value (SAR)</th>
                                <th>نسبة المنصرف / Percentage Paid (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Dynamic Rows for Payment Claims */}
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i}>
                                    <td>{i}</td>
                                    <td>
                                        <input 
                                            type="number" 
                                            name={`paymentClaim${i}`} 
                                            className="paymentClaim" 
                                            value={formData[`paymentClaim${i}`]} 
                                            onChange={handleChange} 
                                            required 
                                            min="0"
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            name={`advanceDeduction${i}`} 
                                            className="advanceDeduction" 
                                            value={formData[`advanceDeduction${i}`]} 
                                            readOnly 
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            name={`penalty${i}`} 
                                            className="penalty" 
                                            value={formData[`penalty${i}`]} 
                                            readOnly 
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            name={`paidUntil${i}`} 
                                            className="paidUntil" 
                                            value={formData[`paidUntil${i}`]} 
                                            readOnly 
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            name={`remaining${i}`} 
                                            className="remaining" 
                                            value={formData[`remaining${i}`]} 
                                            readOnly 
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            name={`percentage${i}`} 
                                            className="percentage" 
                                            value={formData[`percentage${i}`]} 
                                            readOnly 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="1">الإجمالي / Total</td>
                                <td><input type="number" id="totalClaim" name="totalClaim" value={formData.totalClaim} readOnly /></td>
                                <td><input type="number" id="totalAdvanceDeduction" name="totalAdvanceDeduction" value={formData.totalAdvanceDeduction} readOnly /></td>
                                <td><input type="number" id="totalPenalty" name="totalPenalty" value={formData.totalPenalty} readOnly /></td>
                                <td><input type="number" id="totalPaid" name="totalPaid" value={formData.totalPaid} readOnly /></td>
                                <td><input type="number" id="totalRemaining" name="totalRemaining" value={formData.totalRemaining} readOnly /></td>
                                <td><input type="text" id="totalPercentage" name="totalPercentage" value={formData.totalPercentage} readOnly /></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                {/* Section 5: Signatures */}
                <div className={styles.section}>
                    <h3>التوقيعات / Signatures</h3>
                    
                    <div className={styles.signatureSection}>
                        <div className={styles.signature}>
                            <label htmlFor="projectManagerSignature">المشرف / Project Manager</label><br />
                            <input 
                                type="text" 
                                id="projectManagerSignature" 
                                name="projectManagerSignature" 
                                placeholder="الاسم / Name" 
                                value={formData.projectManagerSignature} 
                                onChange={handleChange} 
                                required 
                            /><br />
                            {/* Removed 'required' from file input */}
                            <input 
                                type="file" 
                                name="projectManagerSignatureFile" 
                                onChange={handleChange} 
                            />
                        </div>
                        
                        <div className={styles.signature}>
                            <label htmlFor="vpSignature">نائب الرئيس للقطاع / VP</label><br />
                            <input 
                                type="text" 
                                id="vpSignature" 
                                name="vpSignature" 
                                placeholder="الاسم / Name" 
                                value={formData.vpSignature} 
                                onChange={handleChange} 
                                required 
                            /><br />
                            {/* Removed 'required' from file input */}
                            <input 
                                type="file" 
                                name="vpSignatureFile" 
                                onChange={handleChange} 
                            />
                        </div>
                        
                        <div className={styles.signature}>
                            <label htmlFor="ssvpSignature">نائب الرئيس التنفيذي للخدمات المشتركة / SSVP</label><br />
                            <input 
                                type="text" 
                                id="ssvpSignature" 
                                name="ssvpSignature" 
                                value={formData.ssvpSignature} 
                                readOnly 
                            /><br />
                            {/* Removed 'required' from file input */}
                            <input 
                                type="file" 
                                name="ssvpSignatureFile" 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                </div>
                
                {/* Submit Button */}
                <div className={styles.submitBtn}>
                    <button type="submit">Submit / إرسال</button>
                </div>
                
            </form>
        </div>
    );

};

export default CertificationForm;
