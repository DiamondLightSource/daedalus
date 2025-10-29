#!/bin/bash

# Parse command line options
VALID_ARGS=$(getopt -o hn: --long help:nscreens:, -- "$@")
if [[ $? -ne 0 ]]; then
    exit 1;
fi

eval set -- "$VALID_ARGS"
while [ : ]; do
    case "$1" in
        -h | --help)
            Help
            exit 1
            ;;
        -n | --nscreens)
            N_SCREENS="$2"
            if ! [[ $N_SCREENS =~ ^[0-9]+$ ]]; then
                echo "Screen index must be an integer"
                exit
            fi
            shift 2
            ;;
        --) shift; 
            break 
            ;;
    esac
done

files_1=('index')
files_3=('index' 'M3' 'IMG1')
files_5=('index' 'M3' 'IMG1' 'IONP1' 'PIRG1')
files_10=('index' 'M3' 'IMG1' 'IONP1' 'PIRG1' 'IONP2' 'IMG11' 'IONP11' 'PIRG11')
files_all=('index' 'M3' 'IMG1' 'IONP1' 'PIRG1' 'IONP2' 'IMG11' 'IONP11' 'PIRG11' 'IMG12' 'IONP12' 'PIRG12' 'SPACE11' 'MOD1' 'MOD2')

# Change files array to different length
address="phoebus.sh -clear"
for f in "${files_all[@]}";
do
    # Add "?target=window" at the end of this string to test opening in separate windows vs tabs
	address+=" -resource http://localhost:8000/example-synoptic/b23-services/synoptic/opis/"${f}".bob?target=window"
done
$address
