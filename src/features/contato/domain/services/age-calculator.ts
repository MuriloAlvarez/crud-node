export class AgeCalculator {
  public static calculate(
    birthDate: Date,
    referenceDate: Date = new Date(),
  ): number {
    const birth = new Date(birthDate);
    const reference = new Date(referenceDate);

    if (Number.isNaN(birth.getTime()) || Number.isNaN(reference.getTime())) {
      throw new Error("Datas invalidas para calcular idade");
    }

    let age = reference.getUTCFullYear() - birth.getUTCFullYear();
    const didNotHaveBirthdayYet =
      reference.getUTCMonth() < birth.getUTCMonth() ||
      (reference.getUTCMonth() === birth.getUTCMonth() &&
        reference.getUTCDate() < birth.getUTCDate());

    if (didNotHaveBirthdayYet) {
      age -= 1;
    }

    return age;
  }
}
