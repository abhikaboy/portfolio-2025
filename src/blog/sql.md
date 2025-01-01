# Learning SQL

# Basic Statement Dictionary

## Select

- SELECT `column_name` FROM `table_name`;
    
    Select c1 from Table 1 → a
    
- SELECT `column_name`, `column_name` FROM `table_name`;
    
    select c1,c2 from table2 → e,f & g,h
    
- SELECT `*` FROM `table_name`;
    
    select * from Table3 → i,k, k,l
    

## Distinct

In general, this is used to filter the results of a query to eliminate duplicates 

- SELECT DISTINCT `column` FROM `table`
    
    

## Table 1

## Table2

## Table3

| c1 | c2 |
| --- | --- |
| a | c |
| b | d |

| c1 | c2 |
| --- | --- |
| e | g |
| f | h |

| c1 | c2 |
| --- | --- |
| i | k |
| j | l |

## Count

Returns the count of the number of rows that meet a certain criteria.

## Employees

## Queries

| Name | Age |
| --- | --- |
| Bob | 23 |
| Joe | 42 |
| Rob | 11 |
| Bill | 42 |

SELECT COUNT(`*`) FROM `employees`

- 5

SELECT COUNT (DISTINCT Age) from `employees`

- 3

SELECT COUNT(`column_name`) from `employees`

- Counts the number of non nulls in column

## Where

is typically used with select to filter the rows based on specific conditions 

- SELECT `column_name` FROM `table_name` WHERE `conditions`
    - SELECT * FROM Employees WHERE department = ‘Finance’;

## Orderby

Sorts the result set of a query in a specific order 

1) Data Presentation

2) Data Analysis 

3) Pagination 

SELECT `column_name`, `column_two`, FROM `table_name` WHERE `condition` ORDER BY `column_one` ASC, `column2` DESC

## LIMIT

Restrict the number of rows returned by a query

SELECT first_name FROM employees LIMIT 30 OFFSET 10

# Conditions

Logical statement that evaluates to true or false for each row in a table. Common operators include:

| = | checks equality | SELECT * FROM Employees WHERE department = ‘Finance’; |
| --- | --- | --- |
| <> or ≠ | not equal | SELECT * FROM Employees WHERE salary <> 10000 |
| > | greater | SELECT * FROM Employees WHERE salary > 10000 |
| < | less | SELECT * FROM Employees WHERE salary < 10000 |
| BETWEEN | between vals (inclusive) | SELECT * FROM Employees WHERE salary BETWEEN 10000 AND 20000 |
| LIKE | Pattern matching using wildcards (uses % and _) | SELECT * FROM Employees WHERE first_name LIKE ‘J%’ |
| IN | Matches any values in a list  | SELECT * FROM Employees WHERE department IN (’finance’,’hr’,’admin’) |
| IS NULL  | Checks for Null | SELECT * FROM Employees WHERE phone IS NULL |
| AND, OR, NOT | Combines conditions  |  |

# Pattern Matching

%: Represents any sequence of characters 

- J%: starts with J
- %blue%: Contains work Blue
- %son: Ends in son

_: Represents a single character 

[]: Represents a character class 

# Aggregate Functions

MAX 

MIN

AVG

SELECT SUM(`column`) FROM `table`

# Joins

Combines two rows in a table based ON some sort of criteria 

SELECT `columns` from `Left Table` INNER JOIN `Right Table` ON `condition`

SELECT first_name AS f, last_name AS l , base_name FROM martian INNER JOIN base ON martain.base_id = base.base_id

`ON:` Specifies HOW rows from the two tables will be connected 

## Types of Joins

Left Join: Every row from left, and adds right row if ON is true. Else  Will return null for all cols in right table 

Inner Join: Only rows where ON is true 

Right Join: Every row in right table. if ON is false, all cols in left table will be null

Full Join: Every row from both tables, if ON is false, the cols will be null 

---

### Join Examples

SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate

FROM Orders

INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;