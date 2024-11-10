document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('profile-form');
    const messageDiv = document.getElementById('message');
    
    function fetchUserData() {
        return fetch("/api/userdata")
          .then((response) => response.json())
          .then((data) => {
            username = data.username;
            roll = data.roll;
            email = data.email
            Name = data.name;
            year = data.year.slice(0,1);
            branch = data.branch;
          });
      }


    fetchUserData().then(() => {    
        document.getElementById('username').value = username;
        document.getElementById('name').value = Name;
        document.getElementById('email').value = email;
        document.getElementById('rollno').value = roll;
        document.getElementById('branch').value = branch;
        document.getElementById('year').value =  year;})

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const rollno = document.getElementById('rollno').value;
        const branch = document.getElementById('branch').value;
        const year = document.getElementById('year').value;
        

        if (!['ECE','CSE','DSAI'].includes(branch)) {
            messageDiv.innerHTML = "<p style='color: red;'>Please fill in all fields correctly.</p>";
            return;
        }
        else{
            messageDiv.innerHTML = `<p style='color: green;'>Profile updated successfully!</p>`;
        }

        form.submit();

    });
});
