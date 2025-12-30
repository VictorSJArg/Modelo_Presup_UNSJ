/**
 * Distributes a total integer value across a set of categories defined by percentages,
 * ensuring the sum of the distributed values equals the original total.
 * Uses the Largest Remainder Method (Hamilton method).
 * 
 * @param total The total integer amount to distribute (e.g., 1210 students)
 * @param percentages An array of percentages (0.0 to 1.0) for each category
 * @returns An array of integers summing exactly to 'total'
 */
export function calculateDistributedStudents(total: number, percentages: number[]): number[] {
    const exactValues = percentages.map(p => total * p);
    const floors = exactValues.map(v => Math.floor(v));
    const remainders = exactValues.map((v, i) => ({ val: v - floors[i], index: i }));

    let currentSum = floors.reduce((a, b) => a + b, 0);
    const difference = Math.round(total - currentSum);

    // Sort by remainder descending
    remainders.sort((a, b) => b.val - a.val);

    // Distribute the difference to the ones with highest remainders
    for (let i = 0; i < difference; i++) {
        floors[remainders[i].index]++;
    }

    return floors;
}
