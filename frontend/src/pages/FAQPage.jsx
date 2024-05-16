export default function FAQPage() {

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
        border: '1px solid black'
    };

    const thTdStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'left'
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Frequently Asked Questions (FAQ)</h1>

            <h2 style={{ fontSize: '18px', marginTop: '20px', color: '#000' }}>What type of CSV data is accepted by the system?</h2>
            <p style={{ fontSize: '16px' }}>Our platform supports structured CSV data for student, Belbin, and effort details. Below, you can find specific formats and examples for each type of data.</p>

            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000' }}>Student Data</h3>
            <p><strong>Format and Example:</strong></p>

            <ul style={{ fontSize: '16px' }}>
                <li><strong>studentId:</strong> Must be an 8-digit number.</li>
                <li><strong>labCode:</strong> Must be prefixed by the number and '_' minimally.</li>
                <li><strong>gender:</strong> Must be a single character (M or F).</li>
            </ul>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thTdStyle}>studentId</th>
                        <th style={thTdStyle}>labCode</th>
                        <th style={thTdStyle}>lastName</th>
                        <th style={thTdStyle}>preferredName</th>
                        <th style={thTdStyle}>email</th>
                        <th style={thTdStyle}>wam</th>
                        <th style={thTdStyle}>gender</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={thTdStyle}>12345678</td>
                        <td style={thTdStyle}>01_DualMode</td>
                        <td style={thTdStyle}>Jim</td>
                        <td style={thTdStyle}>White</td>
                        <td style={thTdStyle}>jwhi0001@student.monash.edu</td>
                        <td style={thTdStyle}>93</td>
                        <td style={thTdStyle}>M</td>
                    </tr>
                    <tr>
                        <td style={thTdStyle}>28462818</td>
                        <td style={thTdStyle}>02_OnCampus</td>
                        <td style={thTdStyle}>Jemma</td>
                        <td style={thTdStyle}>Black</td>
                        <td style={thTdStyle}>jbla0001@student.monash.edu</td>
                        <td style={thTdStyle}>93</td>
                        <td style={thTdStyle}>F</td>
                    </tr>
                </tbody>
            </table>

            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000' }}>Belbin Data</h3>
            <p><strong>Overview:</strong></p>
            <p>The Belbin model identifies behavioural strengths and weaknesses in the workplace. Accepted values for Belbin type are:</p>
            <ul style={{ fontSize: '16px' }}>
                <li>People</li>
                <li>Thinking</li>
                <li>Action</li>
            </ul>
            <p><strong>Example:</strong></p>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thTdStyle}>studentId</th>
                        <th style={thTdStyle}>belbinType</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={thTdStyle}>12345678</td>
                        <td style={thTdStyle}>people</td>
                    </tr>
                    <tr>
                        <td style={thTdStyle}>28462818</td>
                        <td style={thTdStyle}>thinking</td>
                    </tr>
                </tbody>
            </table>

            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000' }}>Effort Data</h3>
            <p><strong>Description:</strong></p>
            <p>Hours Commitment is the estimated number of hours that a student expects to commit in a week.</p>
            <p><strong>Example:</strong></p>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thTdStyle}>studentId</th>
                        <th style={thTdStyle}>hourCommitment</th>
                        <th style={thTdStyle}>avgAssignmentMark</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={thTdStyle}>12345678</td>
                        <td style={thTdStyle}>13</td>
                        <td style={thTdStyle}>73</td>
                    </tr>
                    <tr>
                        <td style={thTdStyle}>28462818</td>
                        <td style={thTdStyle}>18</td>
                        <td style={thTdStyle}>84</td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
}
