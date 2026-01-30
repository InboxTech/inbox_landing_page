document.addEventListener("DOMContentLoaded", () => {
  AOS.init({ once: true });

  // Snackbar function
  function showSnackbar(message, type = "success") {
    const snackbar = document.getElementById("snackbar");
    snackbar.textContent = message;
    snackbar.className = `show ${type}`;

    setTimeout(() => {
      snackbar.className = snackbar.className.replace("show", "");
    }, 4000);
  }

  // Toggle Other fields
  window.toggleOtherField = function (select, inputId) {
    const input = document.getElementById(inputId);

    if (select.value === "Other") {
      input.classList.remove("d-none");
      input.required = true;
    } else {
      input.classList.add("d-none");
      input.required = false;
      input.value = "";
    }
  };

  const form = document.querySelector(".web3form");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Industry
    if (form.industry.value === "Other") {
      formData.set("industry", form.industry_other.value);
    } else {
      formData.set("industry", form.industry.value);
    }
    formData.delete("industry_other");

    // Services
    if (form.services.value === "Other") {
      formData.set("services", form.services_other.value);
    } else {
      formData.set("services", form.services.value);
    }
    formData.delete("services_other");

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        showSnackbar(
          "Your assessment request has been received. Our team will review it and contact you shortly.",
          "success",
        );
        form.reset();
        document.getElementById("industry_other").classList.add("d-none");
        document.getElementById("services_other").classList.add("d-none");
      } else {
        showSnackbar(result.message || "Submission failed", "error");
      }
    } catch (err) {
      showSnackbar(
        "We were unable to submit your request at this time. Please try again shortly.",
        "error",
      );
    } finally {
      submitBtn.textContent = "Schedule Assessment";
      submitBtn.disabled = false;
    }
  });
});
