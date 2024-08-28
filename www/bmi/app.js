function calBmi() {
    let weight = document.getElementById("weight").value
    let height = document.getElementById("height").value / 100

    let bmi = weight / (height * height)

    if (bmi < 18.5) {
        console.log("กินอีกหน่อยนะ")
        document.getElementById("result").innerText = "BMI: " + bmi.toFixed(2) + " กินอีกหน่อยนะ"
    } else if (bmi < 22.9) {
        console.log("ดี")
        document.getElementById("result").innerText = "BMI: " + bmi.toFixed(2) + " ดี"
    } else if (bmi < 24.9) {
        console.log("พอดี")
        document.getElementById("result").innerText = "BMI: " + bmi.toFixed(2) + " พอดี"
    } else if (bmi < 29.9) {
        console.log("อวบ")
        document.getElementById("result").innerText = "BMI: " + bmi.toFixed(2) + " อวบ"
    } else {
        console.log("อิ่ม")
        document.getElementById("result").innerText = "BMI: " + bmi.toFixed(2) + " อิ่ม"
    }

    console.log(weight, height, bmi)
}