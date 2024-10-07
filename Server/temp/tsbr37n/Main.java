#include <iostream>

int main() {
    // Print the table for 2
    std::cout << "Multiplication Table of 2:" << std::endl;
    for (int i = 1; i <= 10; i++) {
        std::cout << "2 x " << i << " = " << (2 * i) << std::endl;
    }

    std::cout << std::endl; // Print a blank line for better readability

    // Print the table for 3
    std::cout << "Multiplication Table of 3:" << std::endl;
    for (int i = 1; i <= 10; i++) {
        std::cout << "3 x " << i << " = " << (3 * i) << std::endl;
    }

    return 0;
}
