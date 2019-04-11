#include <iostream>
using namespace std;
 
int main()
{
	int arr[100];
	int size, i, j, temp;
 
	cin>>size;
 

	for(i=0; i<size; i++)
	{
		cin>>arr[i];
	}
	for(i=0; i<size; i++)
	{
		for(j=i+1; j<size; j++)
		{
			//If there is a smaller element found on right of the array then swap it.
			if(arr[j] < arr[i])
			{
				temp = arr[i];
				arr[i] = arr[j];
				arr[j] = temp;
			}
		}
	}

	cout<<"Elements of array in sorted ascending order:"<<endl;
	for(i=0; i<size; i++)
	{
		cout<<arr[i]<<endl;
	}
 
	return 0;
}
 