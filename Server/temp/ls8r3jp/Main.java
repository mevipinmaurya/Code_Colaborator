#include <stdio.h>

int main() {
    // Print the table for 2
    printf("Multiplication Table of 2:\n");
    for (int i = 1; i <= 10; i++) {
        printf("2 x %d = %d\n", i, 2 * i);
    }

    printf("\n"); // Print a blank line for better readability

    // Print the table for 3
    printf("Multiplication Table of 3:\n");
    for (int i = 1; i <= 10; i++) {
        printf("3 x %d = %d\n", i, 3 * i);
    }

    return 0;
}