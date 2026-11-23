# Linear Algebra

[Course Cheat Sheet ](https://www.notion.so/Course-Cheat-Sheet-159a5d526915805d9c43d1098429b0b3?pvs=21)

## Exam #3 Lock TF in

5.3 Orthogonal Transformations and Orthogonal Matrices

## 5.4 Least Squares and Data Fitting

- Finding approximate solutions to equations without solutions
- Ax=B
- “Least square” refers to the fact that it solves it as closely as possible
- A^T Ax = A^T B
- A transpose has the rows and the columns flipped
- [https://textbooks.math.gatech.edu/ila/least-squares.html](https://textbooks.math.gatech.edu/ila/least-squares.html)

![IMG_3019.jpeg](Linear%20Algebra%20134a5d52691580cbabbfeed575d6d7a7/IMG_3019.jpeg)

## 6.1 Introduction to Determinants

[https://textbooks.math.gatech.edu/ila/chap-determinant.html](https://textbooks.math.gatech.edu/ila/chap-determinant.html)

- A determinant is denoted by “det(A)”
- can use row reduction to determine it

**Note:**

1. If a matrix is already in row echelon form → view determinant as the product of the diagonal entries. 
2. It turns out this is true for a slightly larger class of matrices called *triangular*.
3. Doing row replacement on A does not change det(A)
4. Scaling a row by A by a scalar c multiplies the determinant by c 
    1. if the determinant was 7, multiplying A by 2 will make determinant 14
5. Swapping two rows multiplies the determinant by -1  
6. Identity Matrix has the determinant value of 1 

**We assign a number that will satisfy all these properties**

### Formula for 2x2 Matrix

[a,b] = ad-bc

[c,d]

![image.png](Linear%20Algebra%20134a5d52691580cbabbfeed575d6d7a7/image.png)

![image.png](Linear%20Algebra%20134a5d52691580cbabbfeed575d6d7a7/image%201.png)

## 6.2 Properties of Determinants

**Properties**

1. A square Matrix is invertible iif det(A) =/= 0
2. otherwise if the determinent is 0, then the transformation is squishing it into lower dimension
1. let A be a square matrix, if the rows or columns of A are linearly dependent, det(A) is 0 
2. **Multiplicative Property:** det(AB) = det(A)det(B)
3. **Transpose Property:** det(A) = det(A^T)
4. The determinant of an upper-triangular or lower-triangular matrix is the product of the diagonal entries.

Only way for the product of a matrix & a non zero vector to be 0 is if the transformation associated with that space squishes space into a lower dimension det(A) = 0 

## 7.1 Diagonalization, Eigenvalues

1. Eigenvectors → Vectors that span themselves during linear transformations 
    1. iow: The vector will stay on the line that it originally spans out during a linear transformation
2. Eigenvalues → The actual quantity of how much the scale factor is 

### Diagonalization

### Trace

1. Sum of the elements on the main diagonal 

### Intuition

This is the process of simplifying a matrix by writing it in a specific form. Not all matracies are diagonalizable, but those who are must have an inverse and satisfy the following equation: 

$$
X^{-1}AX=D
$$

- D is made from the eigenvalues of A
- X is made from the eigenvectors

Starting matrix A and Diagonal matrix D are related by a special change of basis matrix X (or P)

1. A has unique Eigenvalues 
2. A can have duplicate eigenvalues if they are linearly independent 
3. A = XDX^-1 → original 

**Summary:** Transforms A into a simpler matrix while preserving characteristics like eigenvalues that is easier when preforming operations and understanding its behavior 

### Why Diagonalize?

These simplified matrices are much easier to work with

1. taking the power is very simple 

### When Diagonalize?

Must have enough linearly independent eigenvectors to form columns of X: 

- for an *n x n *****matrix, you need n linearly independent eigenvectors

## 7.2 Finding the Eigenvalues of a Matrix

Av = λv → Our Transformation times a Vector is the same as some number (Eigenvalue) times that same Vector

Represents the fact that this linear transformation is the same thing as original vector time magic eigenvalue

**Can also represent this as:**

Av = λIv → multiply the λ by identity matrix to basically convert it into a matrix, that way we are multiplying by a matrix on both sides 

**Bring it to the same side:**

(A-λI)v = 0 → ends up looking like the original matrix with a minus lambda on the diagonal

And since we know that any matrix times a vector that results in zero will have a determinant of 0, we can use that information. 

det(A-λI) = 0 → we want to find the values that satisfy this equation 

**TLDR: Minus Lambda on all diagonal values of Matrix A** 

---

**Trick for 2x2:**

Sum of diagonal / 2 = the sum of eigenvalues / 2 (mean)

Determinant is = to product of two eigenvalues  (product)

$$
m\pm \sqrt{(m^2-p)}
$$

## 7.3 Finding the Eigenvectors of a Matrix

Once you compute the Eigenvalues for a matrix, you will get get multiple options. From there you will plug in each eigenvalue and solve the equation for v.

**Diagonal Matrcies** → all of its basis vectors are eigenvectors; diagonal entries are their eigenvalues  

Set of basis vectors that happen to also be eigenvectors are called an eigenbasis  

**Eigenspace →** Set of all vectors that satisfy the equation 

$$
(A-λI)v=0
$$

- Essentially: The set of all eigenvectors corresponding to λ

## 8.1 Symmetric Matrices

![image.png](Linear%20Algebra%20134a5d52691580cbabbfeed575d6d7a7/image%202.png)

A Symmetric matrix is one that is equal to its transpose; meaning that if you flipped the rows and columns it would be the same matrix 

### Properties

1. Diagonalizable 
2. Real Eigenvalues 
3. Eigenvectors corresponding to eigenvalues 

## Review: Gram Schmidt Process

Creating an orthonormal basis from a set of vectors that already form a basis 

1. Length of a vector is the square root of the vector dotted with itself 

---

**Formula:**

v1, v2, v3.         u1, u2, u3

![image.png](Linear%20Algebra%20134a5d52691580cbabbfeed575d6d7a7/image%203.png)

how to actually do it:

1. The first term is going to be the (vector / magnitude)
2. the second term is gonna be v2 - (dot v2 and u1^T) * (u1)
    1. divide each term in the resulting matrix by the magnitude of the matrix 
3. third term is gonna be as follows:
    1.